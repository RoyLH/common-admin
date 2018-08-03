'use strict';

let path = require('path'),
    config = require(path.resolve('./config/config'));

module.exports = (app, db) => {
    config.mailGun = {
        api_key: process.env.MAILGUN_API_KEY || 'key-697beead3ec803b1343a384017cba797',
        domain: process.env.MAIL_DOMAIN || 'erealmsoft.com',
        fromWho: process.env.MAIL_FROM_WHO || 'support <support@erealmsoft.com>'
    };
};
