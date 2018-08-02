'use strict';

let path = require('path'),
    config = require(path.resolve('./config/config'));

module.exports = (app, db) => {
    config.mailGun = {
        api_key: process.env.MAILGUN_API_KEY || '',
        domain: process.env.MAIL_DOMAIN || '',
        fromWho: process.env.MAIL_FROM_WHO || ''
    };
};
