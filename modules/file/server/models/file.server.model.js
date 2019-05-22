'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  url = require('url'),
  path = require('path'),
  mongoosePaginate = require('mongoose-paginate'),
  APIError = require(path.resolve('./config/lib/APIError')),
  validator = require('validator');

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property) {
  return (!this.updated || property.length);
};

const FileSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  uniqueName: {
    unique: true,
    type: String
  },
  customName: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    require: true
  },
  link: {
    type: String,
    trim: true,
    require: true
  },
  folder: {
    type: String,
    default: 'index',
    trim: true
  },
  isDir: {
    type: Number,
    enum: [0, 1] // 0: file, 1: folder
  },
  user: {
    type: String,
    trim: true,
    default: ''
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

FileSchema.statics = {
  get(id) {
    return this.findById(id)
            .exec()
            .then((file) => {
              if (file) {
                return file;
              } else {
                const err = new APIError({code: '102003', messageInfo: ['File']}, 404);
                return Promise.reject(err);
              }
            });
  }
};
FileSchema.virtual('type').get(function () {
  if (this.isDir === 1) {
    return 'dir';
  } else if (/\.(jpeg|png|jpg|gif)$/.test(this.name)) {
    return 'img';
  } else {
    return 'doc';
  }
});

FileSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('file', FileSchema, 'files');
