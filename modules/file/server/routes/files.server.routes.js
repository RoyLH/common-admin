'use strict';

const files = require('../controllers/files.server.controller'),
  path = require('path');

module.exports = (app) => {
  app.route('/app/files')
        .get(files.list)
        .delete(files.removeFilesByIds);

  app.route('/app/files/folders')
        .post(files.createFolder);

  app.route('/app/files/:location')
        .post(files.upload);


    // Single file routes
  app.route('/app/files/:fileId')
        .put(files.update)
        .delete(files.delete)
        .get(files.read);

  app.param('fileId', files.fileById);
};
