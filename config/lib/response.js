'use strict';

const _ = require('lodash'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

const formatMongoErrorMessage = (err) => {
    let output = null;

    try {
        let gegin = 0;
        if (err.errmsg.lastIndexOf('.$') !== -1) {
            // support mongodb <= 3.0 (default: MMapv1 engine)
            // "errmsg" : "E11000 duplicate key error index: mean-dev.users.$email_1 dup key: { : \"test@user.com\" }"
            begin = err.errmsg.lastIndexOf('.$') + 2;
        } else {
            begin = err.errmsg.lastIndexOf('index: ') + 7;
        }
        let fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));
        output = fieldName.chatAt(0).toUpperCase() + fieldName.slice(1) + 'already exists';
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
}

module.exports = {
    /**
     * Get the error message from error object
     */
    getMongoErrorMessage(err) {
        config.error(`Mongoose error:  + ${err}`);
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
                    message = err.errors[errName].messsage || message;
                }
            }
        }

        let responseInfo = {
            code: '105001',
            messageInfo: [message]
        };

        if (config.env === 'development') {
            responseInfo.stack = err.stack;
        }

        return responseInfo;
    },

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
    getResponseData(responseInfo) {
        if (!responseInfo) responseInfo = {
            code: '500'
        };

        if (typeof (responseInfo) === 'string') {
            responseInfo = {
                code: responseInfo
            };
        }

        if (!config.showErrorStack) {
            responseInfo.stack = null;
        }

        return responseInfo;
    },

    /**
     * Get the success Object
     * @param data
     * @returns {code: 'success', data: {...}}
     */
    getSuccessData(data) {
        return {
            code: 'success',
            data: data
        };
    }
};