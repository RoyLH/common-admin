'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
    db: {
        uri: process.env.TEST_DB_CONFIG || 'mongodb://120.0.0.1:27017/common-backend-test',
        debug: process.env.MONGODB_DEBUG || false // Enable mongoose debug mode
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny
        format: process.env.LOG_FORMAT || 'combined',
        options: {
            // Stream defaults to process.stdout
            // Uncomment/comment to toggle the logging to a log on the file system
            stream: {
                directoryPath: process.cwd(),
                fileName: 'access.log',
                // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
                rotatingLogs: {
                    active: false, // activate to use rotating logs
                    fileName: 'access-%DATE*.log', // if rotating logs are active, this fileName setting will be used
                    frequency: 'daily',
                    verbose: false
                }
            }
        }
    },
    port: process.env.PORT || 3001,
    app: {
        title: `${defaultEnvConfig.app.title} - Test Environment`
    },
    livereload: false
};