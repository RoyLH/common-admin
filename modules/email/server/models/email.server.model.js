/**
 * Created by Don on 9/28/2017.
 */
'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let EmailTemplateSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    textBody: {
        type: String
    }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

module.exports = mongoose.model('emailTemplate', EmailTemplateSchema, 'emailTemplates');
