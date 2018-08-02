const mongoose = require('mongoose'),
    crypto = require('crypto'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    Schema = mongoose.Schema;

const UserTokenSchema = new Schema({
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
        default: 3,
        enum: [1, 2, 3],    // 1: reset 2: active 3: common
        required: true
    },
    status: {
        type: Number,
        enum: [-1, 0], // -1: invalid, 0: created, 1: used
        default: 0,
        required: true
    },
    expired: {
        type: Date,
        required: true
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

UserTokenSchema.statics = {
    validate(token) {
        let query;
        if (token instanceof Object) {
            query = token;
        } else {
            query = {token: token};
        }
        return this.findOne(query)
            .then(token => {
                if (!token) {
                    return Promise.reject({code: '103001'});
                } else if (token.expired < Date.now()) {
                    return Promise.reject({code: '103002'});
                } else if (token.status !== 0) {
                    return Promise.reject({code: '103003'});
                }
                token.status = -1;
                return token.save();
            })
            .catch(err => Promise.reject(err));
    },
    create(user, type) {
        const token = new this({
            token: crypto.randomBytes(20).toString('hex'),
            user: user,
            type: type || 3,
            expired: Date.now() + config.token.tokenLife
        });
        return token.save();
    }
};
module.exports = mongoose.model('user-token', UserTokenSchema, 'user-tokens');
