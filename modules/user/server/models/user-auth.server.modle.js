'use strict';

let mongoose = require('mongoose'),
    validator = require('validator'),
    path = require('path'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    APIError = require(path.resolve('./config/lib/APIError')),
    usernameRegExp = /^[a-zA-Z]+$/;

let UserAuthSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        sparse: true,
        trim: true,
        unique: true,
        validate: [validateLocalStrategyUsername, 'Please fill a valid username']
    },
    email: {
        unique: true,
        required: true,
        type: String,
        sparse: true,
        lowercase: true,
        trim: true,
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    waitForConfirmEmail: {
        type: String,
        default: '',
        lowercase: true,
        trim: true,
        validate: [validateLocalStrategyEmailIfExists, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        sparse: true,
        trim: true,
        unique: true,
        validate: [validateLocalStrategyPhone, 'Please fill a valid phone']
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    roles: {
        type: [{
            type: String,
            enum: ['user']
        }],
        default: ['user'],
        required: 'Please provide at least one role'
    },
    /* -1: blocked, 0: first login, 1: common, 2: require confirm*/
    password: {
        type: String,
        required: true,
        min: 6
    },
    salt: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

let validateLocalStrategyEmail = function (email) {
    return (!this.updated || validator.isEmail(email, {
        require_tld: false
    }));
};

let validateLocalStrategyEmailIfExists = function (email) {
    return (email === '' || validator.isEmail(email, {
        require_tld: false
    }));
};

let validateLocalStrategyPhone = function (phone) {
    return (!this.updated || validator.isMobilePhone(phone, {
        require_tld: false
    }));
};

let validateLocalStrategyUsername = function (username) {
    return (!this.updated || usernameRegExp.test(username));
};

UserAuthSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = this.salt || crypto.randomBytes(16).toString('base64');
        this.password = crypto.pbkdf2Sync(this.password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
    }
    next();
});

UserAuthSchema.statics = {
    checkDuplicate(account, type) {
        let query = {};
        if (!type) {
            type = this.checkAccountType(account);
            if (!type) {
                return Promise.reject(new APIError({code: '102001'}, 400));
            }
        }
        if (typeof account === 'object') {
            query = account;
        } else {
            query[type] = account;
        }
        return this.findOne(query)
            .then(userAuth => {
                if (userAuth) {
                    return Promise.reject({code: '101005', messageInfo: [type, account]});
                } else {
                    return Promise.resolve();
                }
            });
    },
    checkAccountType(account) {
        let type;
        if (validator.isEmail(account)) {
            type = 'email';
        } else if (usernameRegExp.test(account)) {
            type = 'username';
        } else if (mongoose.Types.ObjectId.isValid(account)) {
            type = '_id';   // last check ObjectId
        }
        return type;
    },
    validateAccount(account, password) {
        return this.get(account)
            .then(userAuth => {
                const isValidate = userAuth.validatePassword(password);
                if (!isValidate) {
                    return Promise.reject({code: '101002'});
                } else {
                    return Promise.resolve(userAuth);
                }
            });
    },
    get() {
        let query = {};
        const account = arguments[0];
        if (typeof account === 'object') {
            query = account;
        } else {
            const type = this.checkAccountType(account);
            if (!type) {
                return Promise.reject(new APIError({code: '102001'}, 400));
            }
            query[type] = account;
        }
        const getUser = this.findOne(query);
        for (let i = 1; i < arguments.length; i++) {
            getUser.populate(arguments[i]);
        }
        return getUser.then(userAuth => {
            if (!userAuth) {
                return Promise.reject({code: '101001', messageInfo: ['User']});
            } else if (userAuth.status === -1) {
                return Promise.reject({code: '101004', messageInfo: ['User']});
            } else {
                return Promise.resolve(userAuth);
            }
        }).catch(err => Promise.reject(err));

    }
};

UserAuthSchema.methods = {
    validatePassword(password) {
        const _this = this;
        return _this.password === crypto.pbkdf2Sync(password, new Buffer(_this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
    }
};

module.exports = mongoose.model('user-auth', UserAuthSchema, 'user-auths');