'use strict';

const mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

const MessageSchema = new Schema({
    code: {
        type: String,
        default: '',
        required: 'Please fill Message code',
        trim: true,
        unique: true
    },
    content: {},
    clients: {
        type: [String]
    },
    type: {
        type: Number,
        default: 1,
        require: 'Please fill Message type',
        trim: true,
        enum: [1, 2, 3, 4]  // 1: error, 2: warning, 3: info, 4: success
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

MessageSchema.plugin(mongoosePaginate);
mongoose.model('message', MessageSchema, 'messages');
