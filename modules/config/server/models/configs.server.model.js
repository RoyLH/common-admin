'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ConfigSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  option: {
    type: String,
    require: true
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

module.exports = mongoose.model('sysConfig', ConfigSchema, 'sysConfigs');
