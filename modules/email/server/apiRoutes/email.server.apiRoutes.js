'use strict';

const path = require('path'),
  email = require('../controllers/email.server.controller'),
  authHelper = require(path.resolve('./config/lib/auth')),
  express = require('express'),
  router = express.Router();

router.post('/emails', authHelper.isClientAllowed, email.send);

module.exports = router;
