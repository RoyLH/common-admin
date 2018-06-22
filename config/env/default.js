'use strict';

const winston = require('winston'),
    path = require('path');

module.exports = {
    app: {
        version: '1.0.0',
        title: process.env.APP_TITLE || 'mean-common-backend',
        description: process.env.APP_DESCRIPTION || 'mean-common-backend',
        keywords: process.env.APP_KEYWORDS || 'mean-common-backend',
        GTMTrackingID: process.env.GTM_TRACKING_ID
    },
    copyright: process.env.APP_TITLE || 'mean-common-backend', // copyright for email templates
    port: process.env.PORT || 7000,
    host: process.env.HOST || '0.0.0.0',
    db: {
        promise: global.Promise,
        uri: process.env.DB_CONFIG_URI || 'mongodb://user:123gogogo@168.63.138.105:27758/commonservice-dev',
        debug: process.env.MONGODB_DEBUG || false // Enable mongoose debug mode
    },
    sessionCookie: {
        maxAge: 24 * (60 * 60 * 1000),
        httpOnly: true,
        secire: true
    },
    sessionSecret: process.env.SESSION_SECRET || 'mean-common-backend',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    // Lusca config
    csrf: {
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    },
    logger: {
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    },
    showErrorStack: true,
    logo: 'modules/core/client/img/logo.png',
    favicon: 'modules/core/client/img/favicon.ico',
    livereload: true
};