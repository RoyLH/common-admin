'use strict';

const mongoose = require('mongoose'),
  mongoosePaginate = require('mongoose-paginate'),
  Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  feedbackName: {
    type: String,
    required: true
  },
  clientName: {
    type: String
  },
  comments: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    enum: [1, 2, 3, 4], // 1 feedback 2, log 3, warning 4, error
    required: true,
    default: 1
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

FeedbackSchema.plugin(mongoosePaginate);
mongoose.model('feedback', FeedbackSchema, 'feedbacks');
