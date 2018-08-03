'use strict';

let fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/config')),
    EmailTemplate = mongoose.model('emailTemplate'),
    handlebars = require('handlebars'),
    Mailgun = require('mailgun-js'),
    mailGun;

/**
 *  Send mail
 * @description Send email to target email
 * @param {object} mailOptions                                      Send Options
 * @param {string} mailOptions.subject                              Mail subject
 * @param {string} mailOptions.to                                   Mail target
 * @param {string} mailOptions.from                                 Sender email address
 * @param {string} mailOptions.html                                 Send body
 * @param {array} [mailOptions.attachments]                         Attachments
 */
function sendMail(mailOptions) {
    config.info('Mail: ', JSON.stringify(mailOptions));
    mailGun.messages().send(mailOptions, function (err, body) {
        // if fails, save to the mail queue.
        if (err || !body.id || body.message !== 'Queued. Thank you.') {
            saveToMailQueue(mailOptions, function (err, newMail) {
                config.info('email options invalid, Error:', err, ', mailOptions: ', JSON.stringify(mailOptions));
            });
        }
    });
}

function Mailer() {
    mailGun = new Mailgun({ apiKey: config.mailGun.api_key, domain: config.mailGun.domain });
    this.loadTemplates();
}

let saveToMailQueue = function (mailOptions, callback) {
    if (!mailOptions || (mailOptions.mqID && mailOptions.mqID !== ''))
        return;
};

/**
 * Render email template
 * @description Render email template by email title
 * @param {string} title                                    Target email template title(id)
 * @param {object} data                                     Variables in target template
 * @param {function} callback
 * @param {boolean} force
 */
Mailer.prototype.renderEmailTemplate = function (title, data, callback, force) {
    if (!title || !data || typeof callback !== 'function') {
        console.error('render email with invalid params.');
        return false;
    }

    let template = null;
    this.emailTemplates.every(function (item) {
        if (title === item.title) {
            template = item;
            return false;
        }
        return true;
    });

    !template && callback('Invalid title in render template.');

    !template.subject || !template.compliedBody && callback('template is invalid, please update template: ' + title);

    callback(null, {
        subject: template.subject,
        body: template.compliedBody(data)
    });
};

Mailer.prototype.loadTemplates = function () {
    let _self = this;
    return EmailTemplate.find()
        .then(templates => {
            _self.emailTemplates = templates.map(template => {
                let compliedBody;
                try {
                    compliedBody = handlebars.compile(template.body);
                } catch (compileErr) {
                    console.error(compileErr)
                    return Promise.reject('compileErr happened in ' + template.title);
                }
                return {
                    title: template.title,
                    subject: template.subject,
                    compliedBody: compliedBody
                }
            });
            console.log('load templates successful');
            return Promise.resolve();
        })
        .catch(err => Promise.reject(err))
};

Mailer.prototype.saveToMailQueue = saveToMailQueue;

/**
 * Send email template
 * @description Send email to target email.
 * @param {string} to                                       Target email address
 * @param {string} title                                    Target email template title(id)
 * @param {object} data                                     Variables in target template
 * @param {string} [fromWho=config.mailGun.fromWho]         Sender email, default from env
 * @param {string} [attachments]                            Attachments
 */
Mailer.prototype.sendEmail = function (to, title, data, fromWho = config.mailGun.fromWho, attachments) {

    let mailOptions = {};
    if (attachments) {
        mailOptions.attachments = attachments;
    }

    if (data.html && data.subject) {
        sendMail(Object.assign(mailOptions, {
            subject: data.subject,
            to: to,
            from: fromWho,
            html: data.html
        }));
    } else {
        this.renderEmailTemplate(title, data, function (err, result) {
            if (!err && !!result) {
                sendMail(Object.assign(mailOptions, {
                    subject: result.subject,
                    to: to,
                    from: fromWho,
                    html: result.body
                }));
            } else {
                config.error('error in rendering template ' + title + ', ' + err);
                return;
            }
        });
    }
};

module.exports = new Mailer();
