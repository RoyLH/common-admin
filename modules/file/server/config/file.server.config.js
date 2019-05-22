'use strict';

const path = require('path'),
  config = require(path.resolve('./config/config'));

module.exports = (app, db) => {
  config.fileOptions = {
        // Convert your chunk to byte
    maxFieldsSize: parseInt(process.env.FILE_MAX_SIZE, 10) || 10 * 1024 * 1024 // 10MB,
  };

    // default folder; all files is stored in this folder;
  config.serverStorageName = './upload';
  config.fileStoragePath = path.resolve('./modules/file/server/lib/' + (process.env.FILE_SAVE_LOCATION || 'upyun') + '.js');
};
