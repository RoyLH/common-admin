'use strict';

const path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    APIError = require(path.resolve('./config/lib/APIError'));

const LanguageAnchorSchema = new Schema({
    key: {
        type: String,
        required: 'Please fill the key'
    },
    clients: {
        type: [String],  // be used in which clients. empty array represent all client
        default: []
    },
    languageData: {
        type: Object,
        required: 'Please fill the data of language'
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

LanguageAnchorSchema.statics = {
    get(id) {
        return this.findById(id)
            .exec()
            .then((languageAnchor) => {
                if (languageAnchor) {
                    return languageAnchor;
                }
                const err = new APIError({code: '102003', messageInfo: ['Language anchor']}, 404);

                return Promise.reject(err);
            });
    }
};

mongoose.model('language-anchor', LanguageAnchorSchema, 'language-anchors');
