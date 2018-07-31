'use strict';

const config = require('../config'),
    mongooseService = require('./mongoose'),
    express = require('./express'),
    chalk = require('chalk');

/**
 * start cron jobs
 */
function startCronJobs() {
    require('./cronJobs').start();
}

module.exports.loadModels = function loadModels() {
    mongooseService.loadModels();
};

module.exports.init = function init(callback) {
    mongooseService.connect(function (db) {
        // Initialize Models
        mongooseService.loadModels();

        // Initialize express
        var app = express.init(db);
        startCronJobs();
        if (callback) callback(app, db, config);
    });
};

module.exports.start = function start(callback) {
    var _this = this;

    _this.init((app, db, config) => {

        // Start the app by listening on <port>
        app.listen(config.port, function () {

            // Create server URL
            var server = 'http://' + config.host + ':' + config.port;

            // Logging initialization
            console.log('--');
            console.log(chalk.green(config.app.title));
            console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
            console.log(chalk.green('server:\t\t\t\t' + server));
            console.log(chalk.green('Database:\t\t\t' + config.db.uri));

            console.log('--');
            if (callback) callback(app, db, config);
        });
    });

};
