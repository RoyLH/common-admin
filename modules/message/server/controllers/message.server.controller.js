'use strict';

const path = require('path'),
    mongoose = require('mongoose'),
    Message = mongoose.model('message'),
    _ = require('lodash');

/**
 * Create a Message
 */
exports.create = (req, res, next) => {
    const message = new Message(req.body);

    message.save()
        .then(message => res.send({
            code: '402001',
            messageInfo: ['message', message.code],
            data: message
        }))
        .catch(next);
};

/**
 * Show the current Message
 */
exports.read = (req, res) => {
    // convert mongoose document to JSON
    const message = req.message ? req.message.toJSON() : {};

    return res.send({
        code: '400000',
        data: message
    });
};

/**
 * Update a Message
 */
exports.update = (req, res, next) => {
    let message = req.message;

    message = _.extend(message, req.body);

    message.save()
        .then(message => res.send({
            code: '402002',
            messageInfo: ['Message', message.code],
            data: message
        }))
        .catch(next);
};

/**
 * Delete an Message
 */
exports.delete = (req, res, next) => {
    const message = req.message;

    message.remove(function (err) {
        if (err) {
            next(err);
        } else {
            return res.send({
                code: '402003',
                messageInfo: [message.code]
            });
        }
    });
};

/**
 * List of Messages
 */
exports.list = (req, res, next) => {
    const language = req.query.language;
    const clientID = req.query.clientID;
    const options = clientID ? {clients: clientID || []} : {};
    Message.find(options)
        .sort('-created')
        .exec(function (err, messages) {
            if (err) {
                next(err);
            } else {
                if (language) {
                    messages.forEach(function (message) {
                        message.content = message.content[language];
                    });
                }
                return res.send({code: '400000', data: messages});
            }
        });
};

/**
 * import JSON to create multiple messages
 * @param {Object} req
 * @param {Array} req.body.list
 * @param res
 * @param next
 */
exports.import = (req, res, next) => {
    let messages = req.body.list;
    if (typeof messages === 'string') {
        messages = JSON.parse(messages);
    }
    Message.remove()
        .then(() => Message.insertMany(messages))
        .then(() => res.send({code: '402004', messageInfo: ['Messages']}))
        .catch(next);
};

exports.getLanguagePackage = (req, res, next) => {
    let code = req.params.code;
    let queryClientID = req.query.clientID;

    let hasClientID = function (clientID) {
        return clientID === queryClientID;
    };

    Message.find().exec((err, list) => {
        if (err) {
            return next(err);
        } else {
            let resultData = list.reduce((pre, currentItem) => {
                if (currentItem.clients.length === 0 || currentItem.clients.some(hasClientID)) {
                    if (currentItem.content[code]) {
                        pre[currentItem.code] = currentItem.content[code];
                    }
                }
                return pre;
            }, {});
            return res.send({
                code: '400000',
                data: resultData
            });
        }
    });
};
/**
 * Message middleware
 */
exports.messageByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            code: '102001',
            messageInfo: {param: 'id'}
        });
    }

    Message.findById(id).exec(function (err, message) {
        if (err) {
            return next(err);
        } else if (!message) {
            return res.status(404)
                .send({
                    code: '404'
                });
        }
        req.message = message;
        next();
    });
};
