'use strict';

var client = require('../controllers/client.server.controller'),
  path = require('path'),
  authHelper = require(path.resolve('./config/lib/auth'));

module.exports = function (app) {

  app.route('/app/clients').all(authHelper.isAllowed)
        .post(client.create)
        .get(client.list);

  app.route('/app/clients/:clientID').all(authHelper.isAllowed)
        .put(client.update)
        .delete(client.delete);

  app.param('clientID', client.clientByID);

};
