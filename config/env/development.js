'use strict';

const defaultEnvConfig = require('./default'),
  path = require('path'),
  winston = require('winston'),
  DailyRotateFile = require('winston-daily-rotate-file');

module.exports = {
  env: 'development',
  port: process.env.PORT || 7000,
  app: {
    title: `${defaultEnvConfig.app.title} - Development Environment`
  }
};
