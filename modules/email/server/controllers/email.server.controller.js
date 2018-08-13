'use strict';

let path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/config')),
    EmailTemplate = mongoose.model('emailTemplate'),
    _ = require('lodash'),
    APIError = require(path.resolve('./config/lib/APIError')),
    mailer = require('./mailer.server.controller');

/**
 * Create an email
 */
exports.create = (req, res, next) => {
    let emailTemplate = new EmailTemplate(req.body);
    emailTemplate.save()
        .then(newTemplate => {
            mailer.loadTemplates();
            return res.send({
                code: '402001',
                data: newTemplate,
                messageInfo: ['Template', newTemplate.name]
            });
        })
        .catch(next);
};

/**
 * get email info by _id
 */
exports.read = (req, res, next) => {
    const emailTemplate = req.emailTemplate;
    return res.send({
        code: '400000',
        data: emailTemplate
    });
};

/**
 * Update an Email
 */
exports.update = (req, res, next) => {
    let emailTemplate = req.emailTemplate;
    emailTemplate = _.merge(emailTemplate, req.body);
    emailTemplate.save()
        .then(emailTemplate => {
            mailer.loadTemplates();
            return res.send({
                code: '402002',
                data: emailTemplate,
                messageInfo: ['Template', emailTemplate.name]
            });
        })
        .catch(next);
};

/**
 * Delete an Email
 */
exports.delete = (req, res, next) => {
    let emailTemplate = req.emailTemplate;
    emailTemplate.remove()
        .then(emaiTemplate => {
            mailer.loadTemplates();
            return res.send({
                code: '402003',
                data: emaiTemplate,
                messageInfo: ['Template', emailTemplate.name]
            });
        })
        .catch(next);
};

/**
 * List of Email
 */
exports.list = (req, res, next) => {
    EmailTemplate.find()
        .sort('-createTime')
        .exec((err, emailTemplates) => {
            if (err) {
                return next(err);
            } else {
                return res.send({ code: '400000', data: emailTemplates });
            }
        });
};

/**
 * Send Email
 * @description Send email to target email
 * @param {object} req                                      Request object
 * @param {string} req.body.target                          Target email address
 * @param {string} req.body.mailTitle                       Email template title
 * @param {string} [req.body.fromWho]                       Sender email address, default value in default env.
 * @param {string} [req.body.otherAttr]                     Other variables in email template.
 * @param {string} [req.body.subject]                       If have this attr and html attr, mail server will send the html directly, do not load the template data from database and render it.
 * @param {string} [req.body.html]                          If have this attr and subject attr, mail server will send the html directly, do not load the template data from database and render it.
 * @param {object} res
 * @param {function} next
 */
exports.send = (req, res, next) => {
    const { target, title, fromWho, info } = req.body;
    if (!target || !title || !info) {
        return next(new APIError('102001', 400));
    }

    mailer.sendEmail(target, title, info, fromWho);
    return res.send({ code: '403001' });
};

/**
 * Email middleware
 */
exports.emailByID = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new APIError('102001', 400));
    }

    EmailTemplate.findById(id)
        .exec((err, emailTemplate) => {
            if (err) {
                return next(err);
            } else if (!emailTemplate) {
                return next(new APIError({ code: '102003', messageInfo: ['EmailTemplate'] }, 400));
            }
            req.emailTemplate = emailTemplate;
            next();
        });
};
