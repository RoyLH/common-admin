'use strict';

const path = require('path'),
    Message = require('../controllers/message.server.controller.js'),
    express = require('express'),
    router = express.Router();

router.route('/messages')
    .get(Message.list);

module.exports = router;
