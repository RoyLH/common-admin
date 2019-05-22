'use strict';

const mongoose = require('mongoose'),
  path = require('path'),
  APIError = require(path.resolve('./config/lib/APIError')),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Auth = mongoose.model('auth');

module.exports = (app, db) => {
    // serialize sessions
  passport.serializeUser((user, done) => {
        // run once when client singnin.
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
        // if client is authenticated, every request will go there, then visit the layout-template in core.views.
    let query = {
      _id: id,
      status: {
        $ne: -1
      }
    };
    Auth.findOne(query, (err, user) => {
      done(err, user);
    });
  });

    // use these strategies
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (username, password, done) => {
    if (!username || !password) {
      return done(new APIError('102001', 400));
    }

    Auth.findOne({email: username.toLowerCase()})
            .then(user => {
              if (!user) {
                return done('101001');
              }
              if (user.status === -1) {
                return done('101004');
              }
              if (!user.authenticate(password)) {
                return done('101002');
              }
              return done(null, user);
            })
            .catch(err => done(err));
  }));

    // Add passport's middleware, after the session has been initialized.
  app.use(passport.initialize());
  app.use(passport.session());
};
