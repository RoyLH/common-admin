'use strict';

const path = require('path'),
  authHelper = require(path.resolve('./config/lib/auth')),
  caches = require('../controllers/caches.server.controller');

module.exports = (app) => {

  app.route('/app/caches').all(authHelper.isAllowed)
        .get(caches.list);

  app.route('/app/caches/:key').all(authHelper.isAllowed)
        .get(caches.read)
        .delete(caches.delete);

};
