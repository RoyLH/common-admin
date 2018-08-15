'use strict';

const path = require('path'),
    languageAnchors = require('../controllers/language-anchors.server.controller.js'),
    authHelper = require(path.resolve('./config/lib/auth')),
    express = require('express'),
    router = express.Router();

router.route('/language/:code')
    .get(languageAnchors.getLanguagePackage);

module.exports = router;
