'use strict';

const path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    messages = require('../controllers/message.server.controller');

module.exports = function (app) {
    app.route('/app/messages').all(authHelper.isAllowed)
        .get(messages.list)
        .post(messages.create);

    app.route('/app/messages/import').all(authHelper.isAllowed)
        .post(messages.import);

    app.route('/app/messages/:messageId').all(authHelper.isAllowed)
        .get(messages.read)
        .put(messages.update)
        .delete(messages.delete);

    app.route('/app/messages/packages/:code')
        .get(messages.getLanguagePackage);

    app.param('messageId', messages.messageByID);
};
