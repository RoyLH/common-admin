'use strict';

const path = require('path'),
  staff = require('../controllers/staff.server.controller'),
  authHelper = require(path.resolve('./config/lib/auth'));

module.exports = (app) => {
  app.route('/app/staffs/:staffId').all(authHelper.isAllowed)
        .put(staff.update)
        .delete(staff.delete);

  app.route('/app/staffs').all(authHelper.isAllowed)
        .get(staff.list)
        .post(staff.create);

  app.route('/app/staffs/:staffId/password').all(authHelper.isAllowed)
        .patch(staff.changePasswordRandom);

  app.route('/app/staffs/:staffId/status').all(authHelper.isAllowed)
        .patch(staff.changeStatus);

  app.param('staffId', staff.staffByID);
};
