'use strict';

const path = require('path'),
    config = require(path.resolve('./config/config')),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Staff = mongoose.model('staff'),
    APIError = require(path.resolve('./config/lib/APIError')),
    mailer = require(path.resolve('./modules/email/server/controllers/mailer.server.controller'));

exports.list = (req, res, next) => {
    const query = {};
    const options = {
        sort: { created: -1 },
        page: req.query.page || 1,
        limit: parseInt(req.query.limit, 10) || 10
    };

    Staff.paginate(query, options, (err, staffs) => {
        staffs.docs.forEach(staff => {
            staff.password = '';
            staff.salt = '';
        });
        if (err) {
            return next(err);
        } else {
            return res.send({
                code: '400000',
                data: staffs
            });
        }
    });
};

exports.create = (req, res, next) => {
    let staffInfo = req.body;
    if (!staffInfo.email) {
        return next(new APIError('102001', 400));
    }
    staffInfo.password = Staff.randomPassword();

    const staff = new Staff(staffInfo);
    staff.save()
        .then(newStaff => {
            mailer.sendEmail(newStaff.email, 'create-staff', {
                email: newStaff.email,
                displayName: newStaff.displayName || newStaff.email,
                password: staffInfo.password
            });
            newStaff.password = '';
            newStaff.salt = '';
            return res.send({
                code: '402001',
                data: newStaff,
                messageInfo: ['Staff', newStaff.email]
            });
        })
        .catch(next);
};

exports.update = (req, res, next) => {
    let staffInfo = req.body;
    let staff = req.model;

    if (staffInfo.email && (staff.email !== staffInfo.email)) {
        staff.email = staffInfo.email;
        mailer.sendTemplate(staffInfo.email, 'create-staff', {
            email: staffInfo.email,
            displayName: staff.displayName || staff.email,
            password: staff.password
        });
    }
    staff = _.merge(staff, staffInfo);
    staff.save()
        .then(staff => {
            staff.password = '';
            staff.salt = '';
            return res.send({
                code: '402002',
                data: staff,
                messageInfo: ['Staff ', staff.email]
            });
        })
        .catch(next);
};

exports.changePasswordRandom = (req, res, next) => {
    let staff = req.model;
    const password = Staff.randomPassword();
    staff.password = password;
    staff.status = 0;
    return staff.save()
        .then(staff => {
            mailer.sendEmail(staff.email, 'reset-password', {
                displayName: staff.displayName,
                email: staff.email,
                password: password
            });
            staff.password = '';
            staff.salt = '';
            return res.send({
                code: '402002',
                data: staff,
                messageInfo: ['password ', 'staff']
            });
        })
        .catch(next);
};

exports.delete = (req, res, next) => {
    let staff = req.model;
    staff.remove()
        .then(() => res.send({
            code: '402003',
            messageInfo: ['Staff', '-1']
        }))
        .catch(next);
};

/** *
 * Active or block a staff with staffId in the url
 * post {active: true or false, changeReason: string }
 */
exports.changeStatus = (req, res, next) => {
    let staff = req.model;
    const status = req.body.active ? 1 : -1;
    const changeReason = req.body.changeReason || '';
    staff = _.merge(staff, {
        status: status,
        changeReason: changeReason
    });
    staff.save()
        .then(staff => {
            return res.send({
                code: staff.status === -1 ? '401003' : '401004',
                messageInfo: ['Staff', staff.status]
            });
        })
        .catch(next);

};


exports.staffByID = (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            code: '400'
        });
    }

    Staff.findById(id, '-salt -password')
        .exec((err, staff) => {
            if (err) {
                return next(err);
            } else if (!staff) {
                return res.status(401).send({
                    code: '403'
                });
            }
            req.model = staff;
            next();
        });
};
