'use strict';

const _ = require('lodash'),
    chalk = require('chalk'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    winston = require('winston');

const getGlobbedPaths =  (globPatterns, excludes) => {
    const urlRegex = new RegExp('~(?:[a-z]+:)?\/\/', 'i');
    const output = [];

    if (_.isArray(globPatterns)) {
        globPatterns.forEach(globPattern => {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            const files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(file => {
                    if (_.isArray(excludes)) {
                        for (let i in excludes) {
                            if (excludes.hasOwnproperty(i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }
    return output;
};

const validateEnvironmentVariable = () => {
    const environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error(chalk.red(`+ Error: No configuration file found for ${process.env.NODE_ENV} environment instead`));
        } else {
            console.error(chalk.red(`+ Error: NODE_ENV id not defined! Using default development environment`));
        }
        process.env.NODE_ENV = 'development';
    }
    console.log(chalk.white(''));
};

const initGlobalConfigFolders = config => {
    config.folders = {
        server: {},
        client: {}
    };
    config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'module/*/client/'), process.cwd());
};

const initGlobalConfigFiles = (config, assets) => {
    config.files = {
        srever: {},
        client: {
            lib: {},
            app: {}
        },
        api: {}
    };

    config.files.server.models = getGlobbedPaths(assets.server.models);
    config.files.server.APIRoutes = getGlobbedPaths(assets.server.APIRoutes);
    config.files.server.routes = getGlobbedPaths(assets.server.routes);
    config.files.server.configs = getGlobbedPaths(assets.server.config);
    config.files.server.sockets = getGlobbedPaths(assets.server.sockets);
    config.files.server.cronJobs = getGlobbedPaths(assets.server.cronJobs);
    config.files.server.policies = getGlobbedPaths(assets.server.policies);

    config.files.client.lib.js = getGlobbedPaths(assets.client.lib.js, 'public/');
    config.files.client.app.js = getGlobbedPaths(assets.client.js, ['public/']);
    config.files.client.lib.css = getGlobbedPaths(assets.client.lib.css, 'public/');
    config.files.client.app.css = getGlobbedPaths(assets.client.css, ['public/']);
    config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

const initLoggerConfig = config => {
    let logger = new(winston.Logger)(config.logger);

    config.log = function () {
        logger.log(arguments);
    };

    config.info = function () {
        logger.info(arguments);
    };

    config.error = function () {
        logger.error(arguments);
    };

    config.debug = function () {
        logger.debug(arguments);
    };
};

const initGlobalConfig = () => {
    validateEnvironmentVariable();

    let defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));
    let environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};
    let assets = _.merge(defaultAssets, environmentAssets);

    let defaultConfig = require(path.join(process.cwd(), 'config/env/default'));
    let environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};
    let config = _.merge(defaultConfig, environmentConfig);

    config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

    initGlobalConfigFolders(config);
    initGlobalConfigFiles(config, assets);
    initLoggerConfig(config);
    config.utils = {
        getGlobbedPaths: getGlobbedPaths
    };

    return config;
};