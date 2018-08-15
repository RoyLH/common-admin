'use strict';

const mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    validator = require('validator'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property) {
    return (!this.updated || property.length);
};

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = function (email) {
    return (!this.updated || validator.isEmail(email, {
        require_tld: false
    }));
};

const StaffSchema = new Schema({
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
    displayName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [validateLocalStrategyEmail, 'please fill a valid email address']
    },
    password: {
        type: String,
        default: ''
    },
    salt: {
        type: String
    },
    profileImageURL: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['admin', 'superuser']
        }],
        default: ['staff'],
        required: 'Please provide at least one role'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'secret'],
        default: 'secret'
    },
    status: {
        type: Number,
        required: true,
        default: 0,
        enum: [-1, 0, 1, 2] // -1: blocked, 0: first login, 1: common, 2: require confirm
    },
    /* For staff register require confirm*/
    changeReason: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

StaffSchema.pre('save', function (next) {
    if (this.firstName && this.lastName && this.isModified('firstName') || this.isModified('lastName')) {
        this.displayName = this.firstName + ' ' + this.lastName;
    }
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

StaffSchema.methods = {
    authenticate: function (plainPassword) {
        this.password = this.hashPassword(plainPassword);
        return this.password;
    },
    hashPassword: function (password) {
        if (this.salt && password) {
            return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
        } else {
            return password;
        }
    }
};

let ALPHA_CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ALPHA = 'abcdefghijklmnopqrstuvwxyz',
    NUM = '0123456789',
    SPL_CHARS = '!@#$^*',
    noOfCAPSAlpha = 2,
    noOfDigits = 2,
    noOfSplChars = 1,
    minLen = 8,
    maxLen = 12;


const getRandomInt = (min, max, data) => {
    let result = Math.floor(Math.random() * (max - min + 1) + min);
    while (data && data[result]) {
        result = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return result;
};

StaffSchema.statics = {
    randomPassword: () => {
        if (process.env.NODE_ENV === 'e2e' || process.env.NODE_ENV === 'test') {
            return 'default';
        }
        let len = getRandomInt(minLen, maxLen);
        let pswd = [];
        let index = 0;
        let i = 0;

        for (i = 0; i < noOfCAPSAlpha; i++) {
            index = getRandomInt(0, len, pswd);
            pswd[index] = ALPHA_CAPS[getRandomInt(0, ALPHA_CAPS.length)];
        }

        for (i = 0; i < noOfDigits; i++) {
            index = getRandomInt(0, len, pswd);
            pswd[index] = NUM[getRandomInt(0, NUM.length)];
        }

        for (i = 0; i < noOfSplChars; i++) {
            index = getRandomInt(0, len, pswd);
            pswd[index] = SPL_CHARS[getRandomInt(0, SPL_CHARS.length)];
        }

        for (i = 0; i < len; i++) {
            if (!pswd[i]) {
                pswd[i] = ALPHA[getRandomInt(0, ALPHA.length)];
            }
        }

        return pswd.join('');
    }
};

StaffSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('staff', StaffSchema, 'staffs');
