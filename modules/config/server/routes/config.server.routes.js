'use strict';

const configs = require('../controllers/config.server.controller'),
  path = require('path'),
  authHelper = require(path.resolve('./config/lib/auth'));

module.exports = (app) => {

    // Config Routes
  app.route('/app/config').all(authHelper.isAllowed)
        .get(configs.list)
        .post(configs.create);

  app.route('/app/config/:configId').all(authHelper.isAllowed)
        .get(configs.read)
        .put(configs.update)
        .delete(configs.delete);

    // Finish by binging the config middleware
  app.param('configId', configs.configByID);
};
