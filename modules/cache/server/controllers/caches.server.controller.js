'use strict';

const path = require('path'),
  config = require(path.resolve('./config/config')),
  redis = require('redis');

let client;

let initClient = () => {
  client = redis.createClient({
    password: config.redis.password,
    host: config.redis.host,
    detect_buffers: true
  });
  return client;
};

exports.client = () => {
  if (!client) {
    return initClient();
  }
};

exports.read = (req, res, next) => {
  let key = req.params.key;
  key = key.replace(new RegExp(/\\/, 'g'), '');
  !client && initClient();
  client.get(key, function (err, reply) {
    res.send({
      code: '400000',
      data: reply
    });
  });
};

exports.delete = (req, res, next) => {
  let key = req.params.key;
  key = key.replace(new RegExp(/\\/, 'g'), '');
  !client && initClient();
  client.del(key, function (err, result) {
    if (err) {
      return next(err);
    } else {
      if (result) {
        return res.send({code: '402003', messageInfo: ['cache']});
      } else {
        return res.send({code: '102003', messageInfo: ['cache']});
      }
    }
  });
};

exports.list = (req, res, next) => {
  const key = req.query.key || '*';
  !client && initClient();
  client.keys(key, function (err, replies) {
    if (err) return next(err);
    const result = replies && replies.map(function (key) {
      return {
        key: key
      };
    });
    res.send({
      code: '400000',
      data: result
    });
  });
};

