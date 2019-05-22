'use strict';
const _ = require('lodash'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

function formatMongoErrorMessage(err) {
  let output;

  try {
    let begin = 0;
    if (err.errmsg.lastIndexOf('.$') !== -1) {
            // support mongodb <= 3.0 (default: MMapv1 engine)
            // "errmsg" : "E11000 duplicate key error index: mean-dev.users.$email_1 dup key: { : \"test@user.com\" }"
      begin = err.errmsg.lastIndexOf('.$') + 2;
    } else {
            // support mongodb >= 3.2 (default: WiredTiger engine)
            // "errmsg" : "E11000 duplicate key error collection: mean-dev.users index: email_1 dup key: { : \"test@user.com\" }"
      begin = err.errmsg.lastIndexOf('index: ') + 7;
    }
    let fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
}

/**
 * Get the error message from error object
 */
exports.getMongoErrorMessage = function (err) {
  config.error('Mongoose error:' + err);
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = formatMongoErrorMessage(err);
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  let responsInfo = {code: '105001', messageInfo: [message]};

  if (config.env === 'development') {
    responsInfo.stack = err.stack;
  }

  return responsInfo;
};

/**
 * Get the formatted response data
 *
 * @params: responsInfo [string or object #{code: 'xxx', data: {}, messageInfo: [...]}# ]
 * @returns  { code: responsInfo.code,
 *    message: format(messages[code].message, responsInfo.messageInfo),
 *    data: responsInfo.data
 *    type: messages[responsInfo.code].type || 'error',
 *    action: messages[code].action || 'OK'
 *  }
 */
exports.getResponseData = function (responsInfo) {
  if (!responsInfo) responsInfo = {code: '500'};
  if (typeof (responsInfo) === 'string') {
    responsInfo = {code: responsInfo};
  }

  if (!config.showErrorStack) {
    responsInfo.stack = null;
  }

  return responsInfo;
};

/**
 * Get the success Object
 * @param data
 * @returns {code: 'success', data: {...}}
 */
exports.getSuccessData = function (data) {
  return {code: 'success', data: data};
};
