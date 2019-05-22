'use strict';

const oauth2orize = require('oauth2orize'),
  path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  Client = mongoose.model('client'),
  UserAuth = mongoose.model('user-auth'),
  OAuthToken = mongoose.model('oauth-token'),
  server = oauth2orize.createServer();

server.serializeClient((client, done) => {
  return done(null, client.clientID);
});

server.deserializeClient((clientID, done) => {
  return Client.findOne({clientID: clientID}).exec(done);
});

server.exchange(oauth2orize.exchange.password({userProperty: 'clientPortal'}, (client, username, password, scope, body, done) => {
  UserAuth.validateAccount(username, password)
        .then(userAuth => {
          const createRefreshToken = OAuthToken.create(userAuth.user, client._id, 0, body.remeberMe);
          const createAccessToken = OAuthToken.create(userAuth.user, client._id, 1);
          return Promise.all([createRefreshToken, createAccessToken]);
        })
        .then(results => {
          const refreshToken = results[0];
          const accessToken = results[1];
          done(null, accessToken.token, {
            refresh_token: refreshToken.token,
            expired: accessToken.expired,
            userId: accessToken.user
          });
        })
        .catch(err => typeof err === 'string' ? done(null, 'error happened', {code: err}) : done(null, 'error happened', err));
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken({userProperty: 'clientPortal'}, (client, refreshToken, scope, body, done) => {
  OAuthToken.validate({type: 0, token: refreshToken})
        .then(token => {
          const createAccessToken = OAuthToken.create(token.user, client._id, 1);
          token.expired = Date.now() + (body.rememberMe ? config.token.userRefreshTokenLongLife : config.token.userRefreshTokenShortLife);
          return Promise.all([token.save(), createAccessToken]);
        })
        .then(results => {
          const refreshToken = results[0];
          const accessToken = results[1];
          done(null, accessToken.token, {
            refresh_token: refreshToken.token,
            expired: accessToken.expired,
            userId: accessToken.user
          });
        })
        .catch(err => err.isClientError ? done(null, 'error happened', err) : done(err));
}));

exports.exchangeToken = server.token();
