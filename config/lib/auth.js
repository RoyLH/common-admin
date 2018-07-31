'use strict';

const passport = require('passport'),
    path = require('path'),
    config = require('../config'),
    responseHandler = require('./response');

let acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.init = () => {
    // Using the memory backend
    config.files.server.policies.forEach((policyPath) => {
        require(path.resolve(policyPath)).invokeRolesPolicies(acl);
    });
};

exports.requiresLogin = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    if (req.xhr) {
        return res.send(responseHandler.getResponseData({code: '600'}));
    } else {
        return res.redirect('/login');
    }
};

exports.requiresOAuthLogin = passport.authenticate('bearer', {session: false});

exports.isAuthAllowed = (req, res, next) => {
    passport.authenticate('bearer', {
        session: false
    }, (err, user, info) => {
        if (info && info.code) {
            return res.status(401).send(responseHandler.getResponseData(info.code));
        }
        let roles = (user && user.roles) ? user.roles : ['guest'];
        req.user = user;

        acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
            if (err) {
                // An authorization error occurred.
                return res.send(responseHandler.getResponseData());
            } else {
                if (isAllowed) {
                    // Access granted! Invoke next middleware
                    return next();
                } else {
                    return res.status(403).send({code: '403'});
                }
            }
        });
    })(req, res, next);
};

exports.isAllowed = (req, res, next) => {
    let user = req.user;
    let roles = (user) ? user.roles : ['guest'];

    acl.areAnyRolesAllowed(role, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
        if (err) {
            // An authorization error occurred.
            return res.send(responseHandler.getResponseData());
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                if (!user) {
                    return res.status(401).send({code: '401'});
                } else {
                    return res.status(403).send({code: '403'});
                }
            }
        }
    });
};

exports.isClientAllowed = (req, res, next) => {
    passport.authenticate(['oauth2-client-password', 'basic'], {
        session: false
    }, (err, clientPortal) => {
        if (!clientPortal) {
            return res.status(401).send({code: 401});
        }
        req.clientPortal = clientPortal;
        next();
    })(req, res, next);
};
