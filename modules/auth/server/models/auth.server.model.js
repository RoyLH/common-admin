'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    crypto = require('crypto'),
    path = require('path'),
    APIError = require(path.resolve('./config/lib/APIError'));

/**
 * A Validation for local strategy properties
 */
let validateLocalStrategyProperty = (property) => {
    return (!this.updated || property.length);
};
/**
 * A Validation for local strategy email
 */
let validateLocalStrategyEmail = (email) => {
    return (!this.updated || validator.isEmail(email, {
        require_tld: false
    }));
};

const AuthSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'please fill in your last name']
    },
    middleName: {
        type: String,
        trim: true
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [validateLocalStrategyEmail, 'please fill a valid email address']
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['admin', 'superuser']
        }],
        default: ['admin'],
        required: 'Please provide at least one role'
    },
    status: {
        type: Number,
        required: true,
        default: 0
    } /* -1: blocked, 0: first login, 1: common*/
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

AuthSchema.pre('save', function (next) {
    if (!this.username) {
        this.username = this.email;
    }
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

AuthSchema.statics = {
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError({code: '101001', messageInfo: ['User']}, 404);
                return Promise.reject(err);
            });
    }
};

AuthSchema.methods = {
    authenticate(plainPassword) {
        return this.password === this.hashPassword(plainPassword);
    },
    hashPassword(password) {
        if (this.salt && password) {
            return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
        } else {
            return password;
        }
    }
};

module.exports = mongoose.model('auth', AuthSchema, 'staffs');
