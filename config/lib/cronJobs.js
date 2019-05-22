(function () {
  'use strict';

  const path = require('path'),
    config = require(path.resolve('./config/config'));

  const start = function () {
    config.files.server.cronJobs.forEach((jobPath) => {
      if (~jobPath.indexOf('.js')) require(path.resolve(jobPath));
    });
  };
  module.exports = {
    start: start
  };
}());
