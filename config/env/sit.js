'use strict';

const path = require('path'),
  winston = require('winston'),
  DaillyRotateFile = require('winston-daily-rotate-file');

module.exports = {
  env: 'sit',
  logger: {
    transports: [
      new winston.transports.Console({
        colorize: true
      }),
      new DaillyRotateFile({
        level: 'silly',
        filename: path.resolve('./logs/access-'),
        datePattern: 'yyyy-MM-dd.log',
        maxsize: 5242880 /* 5MB */
      })
    ]
  },
  livereload: false
};
