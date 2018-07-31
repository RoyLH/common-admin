'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash'),
    chalk = require('chalk'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    winston = require('winston');


/**
 * Get files by glob patterns
 */
let getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (let i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
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

/**
 * Validate NODE_ENV existence
 */
let validateEnvironmentVariable = function () {
    let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment! Using development instead'));
        } else {
            console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
        }
        process.env.NODE_ENV = 'development';
    }
    // Reset console color
    console.log(chalk.white(''));
};

/**
 * Initialize global configuration folders
 */
let initGlobalConfigFolders = function (config, assets) {
    // Appending files
    config.folders = {
        server: {},
        client: {}
    };

    // Setting globbed client paths
    config.folders.client = getGlobbedPaths(path.join(process.cwd(), 'modules/*/client/'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Initialize global configuration files
 */
let initGlobalConfigFiles = function (config, assets) {
    // Appending files
    config.files = {
        server: {},
        client: {lib: {}, app: {}},
        api: {}
    };

    // Setting Globbed model files
    config.files.server.models = getGlobbedPaths(assets.server.models);

    // Setting Globbed API route files
    config.files.server.APIRoutes = getGlobbedPaths(assets.server.APIRoutes);

    // Setting Globbed route files
    config.files.server.routes = getGlobbedPaths(assets.server.routes);

    // Setting Globbed config files
    config.files.server.configs = getGlobbedPaths(assets.server.config);

    // Setting Globbed socket files
    config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

    // Setting Globbed cronJob files
    config.files.server.cronJobs = getGlobbedPaths(assets.server.cronJobs);

    // Setting Globbed policies files
    config.files.server.policies = getGlobbedPaths(assets.server.policies);

    // Setting Globbed js files
    config.files.client.lib.js = getGlobbedPaths(assets.client.lib.js, 'public/');
    config.files.client.app.js = getGlobbedPaths(assets.client.js, ['public/']);

    // Setting Globbed css files
    config.files.client.lib.css = getGlobbedPaths(assets.client.lib.css, 'public/');
    config.files.client.app.css = getGlobbedPaths(assets.client.css, ['public/']);

    // Setting Globbed test files
    config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

let initLoggerConfig = function (config) {
    /**
     * Create logger
     */
    let logger = new (winston.Logger)(config.logger);

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
/**
 * Initialize global configuration
 */
let initGlobalConfig = function () {
    // Validate NODE_ENV existence
    validateEnvironmentVariable();

    // Get the default assets
    let defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

    // Get the current assets
    let environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

    // Merge assets
    let assets = _.merge(defaultAssets, environmentAssets);

    // Get the default config
    let defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

    // Get the current config
    let environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

    // Merge config files
    let config = _.merge(defaultConfig, environmentConfig);

    // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
    config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

    // Initialize global globbed files
    initGlobalConfigFiles(config, assets);

    // Initialize global globbed folders
    initGlobalConfigFolders(config, assets);

    // Initialize logger functions.
    initLoggerConfig(config);

    // Expose configuration utilities
    config.utils = {
        getGlobbedPaths: getGlobbedPaths
    };

    return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
