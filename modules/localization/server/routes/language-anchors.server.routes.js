'use strict';

const path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    languageAnchors = require('../controllers/language-anchors.server.controller');

module.exports = (app) => {

    app.route('/app/language-anchors').all(authHelper.isAllowed)
        .get(languageAnchors.list)
        .post(languageAnchors.create);

    app.route('/app/language-anchors/import').all(authHelper.isAllowed)
        .post(languageAnchors.import);

    app.route('/app/language-anchors/:languageAnchorId').all(authHelper.isAllowed)
        .get(languageAnchors.read)
        .put(languageAnchors.update)
        .delete(languageAnchors.delete);

    app.param('languageAnchorId', languageAnchors.languageAnchorByID);
};
