'use strict';

const _ = require('lodash'),
    config = require('../config'),
    chalk = require('chalk'),
    path = require('path'),
    mongoose = require('mongoose');

module.exports = {
    loadModels(callback) {
        config.files.server.models.forEach(modelPath => {
            require(path.resolve(modelPath));
        });
    },

    connect(callback) {
        mongoose.Promise = config.db.promise;

        const options = _.merge(config.db.options || {}, { useMongoClient: true });

        mongoose
            .connect(config.db.uri, options)
            .then(connection => {
                mongoose.set('debug', config.db.debug); // Enabling mongoose debug mode if required

                if (callback) callback(connection.db);
            })
            .catch(error => {
                console.error(chalk.red('Could not connect to MongoDB!'));
                console.log(error);
            });
    },

    disconnect(callback) {
        mongoose.connection.db
            .close(err => {
                console.info(chalk.yellow('Disconnected from MongoDB.'));
                return callback(err);
            });
    }
};