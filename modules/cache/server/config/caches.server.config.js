'use strict';

const path = require('path'),
    config = require(path.resolve('./config/config'));

module.exports = function (app, db) {
    config.redis = {
        host: process.env.REDIS_HOST || '120.27.52.242',
        password: process.env.REDIS_PASSWORD || 'r-2ze9a5ba3d27e034:123Gogogo'
    };
};
