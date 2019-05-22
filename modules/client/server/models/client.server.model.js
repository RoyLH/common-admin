'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ClientSchema = new Schema({
  clientName: {
    type: String,
    unique: 'Client Name already exists',
    lowercase: true,
    trim: true,
    required: 'Please fill the name of your client account'
  },
  clientID: {
    type: String,
    unique: true,
    required: 'Please fill the id of your client account'
  },
  clientSecret: {
    type: String,
    required: true,
    default: crypto.randomBytes(20).toString('hex')
  },
  status: {
    type: Number,
    default: 1,  // 1 active, -1 block
    enum: [-1, 1]
  },
  clientUrl: {
    type: String
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

ClientSchema.path('clientName').validate(function (clientName) {
  return clientName.length && clientName.length < 100;
}, 'client name cannot be blank or too long');

module.exports = mongoose.model('client', ClientSchema, 'clients');
