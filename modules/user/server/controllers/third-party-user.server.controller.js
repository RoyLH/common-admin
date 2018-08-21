'use strict';

const path = require('path'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    _ = require('lodash'),
    config = require(path.resolve('./config/config')),
    UserToken = mongoose.model('user-token'),
    User = mongoose.model('user'),
    UserAuth = mongoose.model('user-auth'),
    OAuthToken = mongoose.model('oauth-token'),
    APIError = require(path.resolve('./config/lib/APIError')),
    ToolServer = require(path.resolve('./modules/email/server/controllers/mailer.server.controller'));

exports.addEmail = (req, res, next) => {
    // this user is userAuth, all the req.user is userAuth
    let user = req.user;
    let {
        path,
        email
    } = req.body;
    let sendEmail = token => {
        const confirmURL = path + '?token=' + token.token;
        // ToolServer.sendEmail(email, 'add-email-confirm', {
        //     displayName: user.displayName || email,
        //     email: email,
        //     confirmURL: confirmURL
        // });
        return res.send({ code: '403001' });
    };
    UserAuth.checkDuplicate(email, 'email')
        .then(UserToken.create)
        .then(sendEmail)
        .catch(next);
};

exports.addEmailConfirm = (req, res, next) => {
    // user type his/her email & password, then request for server
    const {token, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        return res.send({code: '101003'});
    }

    let createEamilAccountForUser = token => {
        return UserAuth.get(token._id, 'user')
            .then(userAuth => {
                let user = userAuth.user;
                user.email = userAuth.waitForConfirmEmail;
                userAuth.email = userAuth.waitForConfirmEmail;
                userAuth.waitForConfirmEmail = null;
                userAuth.passowrd = password;
                return Promise.all([userAuth.save(), user.save()]);
            });
    };

    UserToken.validate({token: token, type: 3})
        .then(createEamilAccountForUser)
        .then(results => {
            let email = results[0].email;
            // ToolServer.sendEmail(email, 'email-added', {
            //     displayName: userInfo.displayName || userInfo.waitForConfirmEmail,
            //     email: userInfo.waitForConfirmEmail
            // });
            return res.send({code: '403001'});
        })
        .catch(next);
};
