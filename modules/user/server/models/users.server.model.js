/**
 * Copyright 2016 JudgeMyFoto, Inc.
 *
 * Created by ken on 06/03/2015.
 */

'use strict';

let mongoose = require('mongoose'),
    path = require('path'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    APIError = require(path.resolve('./config/lib/APIError')),
    mongoosePaginate = require('mongoose-paginate');

const validateLocalStrategyProperty = function (property) {
    return (!this.updated || property.length);
};
const validateLocalStrategyEmail = function (email) {
    return (!this.updated || validator.isEmail(email, {
        require_tld: false
    }));
};
const validateLocalStrategyPhone = function (email) {
    return (!this.updated || validator.isMobilePhone(email, {
        require_tld: false
    }));
};
const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    displayName: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        validate: [validateLocalStrategyPhone, 'Please fill a valid phone number']
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true,
        unique: true,
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'secret'],
        default: 'secret'
    },

    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    profileImage: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

UserSchema.pre('save', function (next) {
    if (this.firstName && this.lastName && this.isModified('firstName') || this.isModified('lastName')) {
        this.displayName = this.firstName + ' ' + this.lastName;
    }
    next();
});

UserSchema.statics = {
    get(id) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return Promise.resolve(new APIError('102001', 400));
        }
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return Promise.resolve(user);
                } else {
                    const err = new APIError({
                        code: '102003',
                        messageInfo: ['user']
                    }, 404);
                    return Promise.reject(err);
                }
            });

    }
};
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('user', UserSchema, 'users');
