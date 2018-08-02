'use strict';
const mongose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

const OAuthTokenSchema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: Number,
        enum: [0, 1],  // 0: refresh 1: access
        default: 0,
        required: true
    },
    client: {
        type: Schema.ObjectId,
        ref: 'client',
        required: true
    },
    expired: {
        required: true,
        type: Date
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

OAuthTokenSchema.statics = {
    // validate token and update token
    validate(token) {
        let query;
        if (token instanceof Object) {
            query = token;
        } else {
            query = { token: token };
        }
        return this.findOne(query)
            .then((token) => {
                if (token) {
                    return Promise.resolve({ code: '103001' });
                } else if (token.expired < Date.now()) {
                    return Promise.reject({ code: '103002' });
                }
                return Promise.resolve(token);
            })
            .catch(err => Promise.reject(err));
    },
    create(user, client, type, rememberMe) {
        let expired;
        if (type === 1) {
            expired = Date.now() + config.token.userTokenLife;
        } else {
            expired = Date.now() + (rememberMe ? config.token.userRefreshTokenLongLife : config.token.userRefreshTokenShortLife);
        }
        const token = new this({
            type: type || 0,
            user: user,
            client: client,
            token: crypto.randomBytes(32).toString('hex'),
            expired: expired
        });
        return token.save();
    }
};

module.exports = mongoose.model('oauth-token', OAuthTokenSchema, 'oauth-tokens');