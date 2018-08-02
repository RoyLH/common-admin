/**
 * Created by Don on 9/28/2017.
 */
'use strict';
var path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    emails = require('../controllers/email.server.controller');

module.exports = (app) => {
    app.route('/app/emails').all(authHelper.isAllowed)
        .get(emails.list)
        .post(emails.create);

    // Single email routes
    app.route('/app/emails/:emailId').all(authHelper.isAllowed)
        .get(emails.read)
        .put(emails.update)
        .delete(emails.delete);

    app.route('/app/emails/test/template').all(authHelper.isAllowed)
        .post(emails.send);

    app.param('emailId', emails.emailByID);
};
