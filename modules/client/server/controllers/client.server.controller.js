'use strict';

const path = require('path'),
    mongoose = require('mongoose'),
    Client = mongoose.model('client'),
    _ = require('lodash');

exports.create = (req, res, next) => {
    const client = new Client(req.body);

    client.save()
        .then(client => res.send({
            code: '402001',
            messageInfo: ['Client', client.clientName]
        }))
        .catch(next);
};

exports.list = (req, res, next) => {
    Client.find()
        .exec((err, clients) => {
            if (err) {
                return next(err);
            } else {
                return res.send({
                    code: '400000',
                    data: clients
                });
            }
        });
};

exports.delete = (req, res, next) => {
    const client = req.client;
    client.remove()
        .then(client => res.send({
            code: '402003',
            messageInfo: ['Client', client.clientName]
        }))
        .catch(next);
};

exports.update = (req, res, next) => {
    let client = req.client;

    client = _.extend(client, req.body);
    client.save()
        .then(() => res.send({
            code: '402002',
            messageInfo: ['Client', client.clientName]
        }))
        .catch(next);
};

module.exports.clientByID = (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            code: '400',
            message: 'Message is invalid'
        });
    }

    Client.findById(id).exec((err, client) => {
        if (err) {
            return next(err);
        } else if (!client) {
            return res.status(404).send({
                code: '404',
                message: 'No Client with that identifier has been found'
            });
        }
        req.client = client;
        next();
    });
};
