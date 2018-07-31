'use strict';

const validator = require('validator'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

/**
 * Render the main application page
 */
exports.renderIndex = (req, res) => {
    let safeUserObject = null;
    if (req.user) {
        safeUserObject = {
            _id: req.user._id,
            displayName: validator.escape(req.user.displayName || ''),
            created: req.user.created.toString(),
            roles: req.user.roles,
            profileImageURL: req.user.profileImageURL,
            email: validator.escape(req.user.email),
            lastName: validator.escape(req.user.lastName),
            firstName: validator.escape(req.user.firstName)
        };
    }

    let sysConfig = {
        title: config.app.title,
        host: res.locals.host
    };

    res.render('modules/core/server/views/index', {
        user: JSON.stringify(safeUserObject),
        config: JSON.stringify(sysConfig)
    });
};

/**
 * Render the server error page
 */
exports.renderServerError = (req, res) => {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = (req, res) => {

    res.status(404).format({
        'text/html': () => {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': () => {
            res.json({
                code: '404'
            });
        },
        'default': () => {
            res.send('Path not found');
        }
    });
};