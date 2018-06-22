'use strict';

const passport = require('passport'),
    path = require('path'),
    config = require('./config'),
    { getMongoErrorMessage, getResponseData, getSuccessData } = require('./response');

let acl = require('acl');

acl = new acl(new acl.memoryBackend());

module.exports = {
    init() {
        // Using the memory backend
        config.files.server.policies.forEach(policyPath => {
            require(path.resolve(policyPath)).invokeRolesPolicies(acl);
        });
    },

    requiresLogin(req, res, next) {
        if (req.isAuthenticated()) return next();
        if (req.xhr) {
            return res.send(getResponseData({ code: '600'}));
        } else {
            return res.redirect('/login');
        }
    },

    requiresOAuthLogin() {
        return passport.authenticate('bearer', { session: false });
    },

    isAuthAllowed(req, res, next) {
        passport.authenticate('bearer', { session: false}, (err, user, info) => {
            if (info && info.code) return res.status(401).send(getMongoErrorMessage(info.code));

            const roles = (user && user.roles) ? user.roles : ['guest'];

            req.user = user;

            acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
                if (err) {
                    // An authorization error occurred.
                    return res.send(getResponseData());
                } else {
                    if (isAllowed) return next();
                    return res.status(403).send({ code: '403' });
                }
            });
        })(req, res, next);
    },

    isAllowed(req, res, next) {
        const user = req.user;
        const roles = user ? user.roles : ['guest'];

        acl.areAnyRolesAllowed(roles, req.route.path. req.method.toLowerCase(), function (err, isAllowed) {
            if (err) {
                return res.send(getResponseData())
            } else {
                if (!user) return res.status(401).send({ code: 401 });
                return res.status(403).send({ code: 403 });
            }
        });
    },

    isClientAllowed(req, res, next) {
        passport.authenticate(['oauth2-client-password', 'basic'], { session: false }, (err, clientPortal) => {
            if (!clientPortal) return res.status(401).send({ code: 401 });
            req.clientPortal = clientPortal;

            next();
        })(req, res, next);
    }
};


