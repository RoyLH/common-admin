'use strict';

const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    UserAuth = mongoose.model('user-auth'),
    OAuthToken = mongoose.model('oauth-token'),
    Client = mongoose.model('client');

module.exports = (app, db) => {
    passport.use(new BasicStrategy((clientID, clientSecret, done) => {
        Client.findOne({
            clientID: clientID
        })
            .exec()
            .then(client => {
                if (!client || (client.clientSecret !== clientSecret)) {
                    return done(null, false);
                } else {
                    return done(null, client);
                }
            })
            .catch(err => done(err));
    }));

    passport.use(new BearerStrategy((accessToken, done) => {
        OAuthToken.findOne({
            type: 1,
            token: accessToken
        }, (err, token) => {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, 'Invalid Refresh Token', {code: '103001'});
            }
            if (token.expired < Date.now()) {
                OAuthToken.remove({
                    type: 1,
                    token: accessToken
                }, (err) => {
                    if (err) {
                        return done(err);
                    } else {
                        return done(null, 'Token expired', {code: '103002'});
                    }
                });
            } else {
                if (token.user !== null) {
                    UserAuth.findOne({user: token.user}, (err, user) => {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, 'Unknown user', {
                                code: '101001',
                                messageInfo: ['User']
                            });
                        }
                        if (user.status === -1) {
                            return done(null, 'Invalid user', {code: '101004'});
                        }
                        // to keep this example simple, restricted scopes are not implemented,
                        // and this is just for illustrative purposes
                        let info = {
                            scope: '*'
                        };
                        return done(null, user, info);
                    });
                } else {
                    // The request came from a client only since userID is null
                    // therefore the client is passed back instead of a user
                    Client.findOne({
                        _id: token.client
                    }, (err, client) => {
                        if (err) {
                            return done(err);
                        }
                        if (!client) {
                            return done(null, false);
                        }
                        // to keep this example simple, restricted scopes are not implemented,
                        // and this is just for illustrative purposes
                        let info = {
                            scope: '*'
                        };

                        return done(null, client, info);
                    });
                }
            }
        });
    }));
};
