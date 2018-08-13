'use strict';

require('dotenv').load();
const app = require('./config/lib/app');
const server = app.start();
