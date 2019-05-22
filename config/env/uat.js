'use strict';

const winston = require('winston'),
  DailyRotateFile = require('winston-daily-rotate-file'),
  path = require('path');

module.exports = {
  env: 'uat',
  logger: {
    transports: [
      new winston.transports.Console({
        colorize: true
      }),
      new DailyRotateFile({
        level: 'silly',
        filename: path.resolve('./logs/access-'),
        datePattern: 'yyyy-MM-dd.log',
        maxsize: 5242880 /* 5MB */
      })
    ]
  },
  livereload: false
};
