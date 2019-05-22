const path = require('path'),
  user = require('../controllers/user.server.controller'),
  authHelper = require(path.resolve('./config/lib/auth'));

module.exports = (app) => {

  app.route('/app/users').all(authHelper.isAllowed)
        .get(user.list);

  app.route('/app/users/:userId').all(authHelper.isAllowed)
        .delete(user.delete)
        .get(user.read)
        .put(user.update);

  app.param('userId', user.userById);

};
