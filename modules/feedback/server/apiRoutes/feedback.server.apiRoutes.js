'use strict';

const path = require('path'),
    feedbacks = require('../controllers/feedbacks.server.controller.js'),
    authHelper = require(path.resolve('./config/lib/auth')),
    express = require('express'),
    router = express.Router();

router.post('/tool/feedback', authHelper.isClientAllowed, feedbacks.create);

module.exports = router;
