'use strict';

require('dotenv').load();

const path = require('path'),
    config = require(path.resolve('./config/config')),
    async = require('async'),
    DBTools = require(path.resolve('./config/lib/mongoose.js'));

/** *
 * execute data migration tasks, supports mode both 'parallel' and 'waterfall', default is 'parallel'
 * the tasks are functions, different mode have some requirements of the functions, see async document.
 * @param tasks
 * @param mode
 */
exports.execMigrationTasks = (tasks, mode) => {
    DBTools.loadModels(() => {
        // Connect to database
        DBTools.connect((db) => {
            const callback = (err) => {
                if (err) {
                    config.error('wrong when exec tasks', err, tasks, mode);
                } else {
                    config.info('done with the migration task successfully.');
                }

                db.close(() => process.exit(0));
            };

            if (tasks.length > 0) {
                if (!mode || mode === 'parallel') {
                    async.parallel(tasks, callback);
                } else if (mode === 'waterfall') {
                    async.waterfall(tasks, callback);
                }
            } else {
                callback();
            }
        });
    });
};
