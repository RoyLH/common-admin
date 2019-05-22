'use strict';

const path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  SysConfig = mongoose.model('sysConfig');

/**
 * Create a SysConfig
 */
exports.create = (req, res, next) => {
  const sysConfig = new SysConfig(req.body);

  sysConfig.save()
        .then(config => res.send({
          code: '402001',
          data: config,
          messageInfo: {data: config.name}
        }))
        .catch(next);
};

/**
 * Show the current SysConfig
 */
exports.read = (req, res) => {
    // convert mongoose document to JSON
  const sysConfig = req.sysConfig ? req.sysConfig.toJSON() : {};
  return res.send({
    code: '400000',
    data: sysConfig
  });
};

/**
 * Update a SysConfig
 */
exports.update = (req, res, next) => {
  let sysConfig = req.sysConfig;
  sysConfig = _.extend(sysConfig, req.body);

  sysConfig.save()
        .then(config => res.send({
          code: '402002',
          data: config,
          messageInfo: {data: config.name}
        }))
        .catch(next);
};

/**
 * Delete an SysConfig
 */
exports.delete = (req, res, next) => {
  const sysConfig = req.sysConfig;

  sysConfig.remove()
        .then(() => res.send({
          code: '402003',
          messageInfo: {data: config.name}
        }))
        .catch(next);
};

/**
 * List of SysConfigs
 */
exports.list = (req, res, next) => {
  SysConfig.find(req.query)
        .sort('-created')
        .exec((err, sysConfigs) => {
          if (err) {
            return next(err);
          } else {
            return res.send({code: '400000', data: sysConfigs});
          }
        });
};

/**
 * SysConfig middleware
 */
exports.configByID = (req, res, next, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      code: 400,
      message: 'SysConfig is invalid'
    });
  }

  SysConfig.findById(id)
        .exec(function (err, sysConfig) {
          if (err) {
            return next(err);
          } else if (!sysConfig) {
            return res.status(404).send({
              code: '102002',
              message: 'No SysConfig with that identifier has been found'
            });
          }
          req.sysConfig = sysConfig;
          next();
        });
};
