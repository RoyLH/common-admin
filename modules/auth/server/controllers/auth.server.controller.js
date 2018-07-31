'use strict';

const passport = require('passport'),
    path = require('path'),
    APIError = require(path.resolve('./config/lib/APIError')),
    mongoose = require('mongoose'),
    Auth = mongoose.model('auth');

exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.send({code: '400000', data: user});
        });
    })(req, res, next);
};

exports.signout = (req, res) => {
    req.logOut();
    res.redirect('/');
};

exports.changePassword = (req, res, next) => {
    let staff = req.user;
    let oldPass = req.body.password;
    let newPass = req.body.newPassword;
    let newPassConfirm = req.body.confirmPassword;
    if (!oldPass || !newPass || newPass.length < 6 || oldPass === newPass) {
        return next(new APIError({code: '102001'}, 400));
    }
    if (newPassConfirm !== newPass) {
        return res.send({code: '101003'});
    }

    Auth.get(staff._id)
        .then((staff) => {
            let isAuth = staff.authenticate(oldPass);
            if (isAuth) {
                staff.password = req.body.newPassword;
                staff.status = 1;
                staff.save()
                    .then(() => {
                        // mailer.sendTemplate(staffInfo.email, 'change-password', {
                        //   displayName: staffInfo.displayName,
                        //   email: staffInfo.email
                        // });
                        req.logOut();
                        return res.send({code: '401002', messageInfo: ['password', 'change']});
                    })
                    .catch(err => next(err));
            } else {
                return res.send({code: '101002'});
            }
        })
        .catch(err => next(err));
};