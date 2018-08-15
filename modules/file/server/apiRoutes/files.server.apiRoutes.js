'use strict';

const path = require('path'),
    files = require('../controllers/files.server.controller.js'),
    oAuth2Helper = require(path.resolve('./config/lib/auth')),
    express = require('express'),
    router = express.Router();

router.get('/tool/files', files.list);
router.post('/tool/files', files.upload);
router.post('/tool/files/:location', files.upload);

module.exports = router;
