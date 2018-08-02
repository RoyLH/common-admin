'use strict';

const path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    express = reuqire('express'),
    userController = require('../controllers/user.server.controller'),
    userUpsert = require('../controllers/user-upsert.server.controller'),
    oauth2 = require('../controllers/oauth2.server.controller'),
    router = express.Router();

router.route('/users/:userId', userController.userById);

router.route('/users')
    .post(userUpsert.signup);

router.route('oauth.token')
    .post(authHelper.isClientAllowed, oauth2.exchangeToken);

router.route('/users/password/forgot')
    .post(userUpsert.passwordForgot);

router.route('/users/confirmation/token')
    .patch(userUpsert.confirmToken);

router.route('/users/password/reset')
    .patch(userUpsert.resetPassword);

router.route('/users/:userId/password')
    .patch(authHelper.isAuthAllowed, userUpsert.changePassword);

router.route('/users/:userId/waitForConfirmEmail')
    .patch(authHelper.isAuthAllowed, userUpsert.changeWaitForConfirmEmail);

router.route('/users/email')
    .patch(authHelper.isAuthAllowed, userUpsert.changeEmailByToken);

router.route('/users/:userId/username')
    .patch(authHelper.isAuthAllowed, userUpsert.changeUsername);

router.route('/users/:userId/profileImage')
    .patch(authHelper.isAuthAllowed, userUpsert.updateProfileImage);

router.param('userId', userController.userById);

module.exports = router;