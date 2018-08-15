'use strict';

const path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    LanguageAnchor = mongoose.model('language-anchor'),
    APIError = require(path.resolve('./config/lib/APIError'));

/**
 * Create a language_anchor
 */
exports.create = (req, res, next) => {
    let languageAnchor = new LanguageAnchor(req.body);

    languageAnchor.save((err) => {
        if (err) {
            return next(err);
        } else {
            return res.send({
                code: '402001',
                messageInfo: ['Language anchor', languageAnchor.name],
                data: languageAnchor
            });
        }
    });
};

/**
 * Show the current language_anchor
 */
exports.read = (req, res, next) => {
    // convert mongoose document to JSON
    let languageAnchor = req.languageAnchor ? req.languageAnchor.toJSON() : {};

    return res.send({
        code: '400000',
        data: languageAnchor
    });
};

/**
 * Update a language_anchor
 */
exports.update = (req, res, next) => {
    let languageAnchor = req.languageAnchor;
    languageAnchor = _.extend(languageAnchor, req.body);
    languageAnchor.save((err) => {
        if (err) {
            return next(err);
        } else {
            return res.send({
                code: '402002',
                messageInfo: ['Language anchor', languageAnchor.key]
            });
        }
    });
};

/**
 * Delete an language_anchor
 */
exports.delete = (req, res, next) => {
    let languageAnchor = req.languageAnchor;
    languageAnchor.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            return res.send({
                code: '402003',
                messageInfo: [languageAnchor.name]
            });
        }
    });
};

exports.import = (req, res, next) => {
    let data = req.body;
    LanguageAnchor.remove({}, () => {
        LanguageAnchor.insertMany(data.reverse(), () => {
            return res.send({
                code: '402004',
                messageInfo: ['Language anchors']
            });
        });
    });
};
/**
 * List of language_anchor
 */
exports.list = (req, res, next) => {
    let options = req.query || {};
    LanguageAnchor.find(options)
        .sort('-created')
        .exec((err, languageAnchorList) => {
            if (err) {
                return next(err);
            } else {
                return res.send({
                    code: '400000',
                    data: languageAnchorList
                });
            }
        });
};

exports.getLanguagePackage = (req, res, next) => {
    let code = req.params.code;
    let queryClientID = req.query.clientID;

    let hasClientID = function (clientID) {
        return clientID === queryClientID;
    };

    LanguageAnchor.find().exec((err, list) => {
        if (err) {
            return next(err);
        } else {
            let resultData = list.reduce((pre, currentItem) => {
                if (currentItem.clients.length === 0 || currentItem.clients.some(hasClientID)) {
                    if (currentItem.languageData[code]) {
                        pre[currentItem.key] = currentItem.languageData[code];
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
 * language_anchor middleware
 */
exports.languageAnchorByID = (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new APIError('102001', 400));
    }

    LanguageAnchor.get(id).then((languageAnchor) => {
        req.languageAnchor = languageAnchor;
        next();
    }, next);
};
