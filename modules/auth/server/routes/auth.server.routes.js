'use strict';

const auth = require('../controllers/auth.server.controller'),
    path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth'));

module.exports = (app) => {
    // admin for user management, not exposed as API
    app.route('/app/auth/signin')
        .post(auth.signin);

    app.route('/app/auth/signout')
        .get(auth.signout);

    app.route('/app/auth/password').all(authHelper.isAllowed)
        .put(auth.changePassword);
};
