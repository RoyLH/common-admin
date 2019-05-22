'use strict';
const mongoose = require('mongoose'),
  path = require('path'),
  passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
  Client = mongoose.model('client');

function checkClient(clientID, clientSecret, done) {
  Client.findOne({
    clientID: clientID,
    status: 1
  })
        .then(client => {
          if (!client) {
            return done(null, false);
          }
          if (client.clientSecret !== clientSecret) {
            return done(null, false);
          }
          return done(null, client);
        })
        .catch(done);
}

module.exports = (app, db) => {
  passport.use(new BasicStrategy(checkClient));
  passport.use(new ClientPasswordStrategy(checkClient));
};
