'use strict';

const path = require('path'),
  mongoose = require('mongoose'),
  UserToken = mongoose.model('user-token'),
  User = mongoose.model('user'),
  UserAuth = mongoose.model('user-auth'),
  OAuthToken = mongoose.model('oauth-token'),
  APIError = require(path.resolve('./config/lib/APIError')),
  mailer = require(path.resolve('./modules/email/server/controllers/mailer.server.controller'));

exports.signup = (req, res, next) => {
  let userInfo = req.body;
  if (!userInfo.email || !userInfo.password || !userInfo.confirmPassword) {
    return next(new APIError({code: '102001'}, 400));
  }
  if (userInfo.password !== userInfo.confirmPassword) {
    return res.send({code: '101003'});
  }
  let saveUser = () => {
    const user = new User(userInfo);
    userInfo.user = user._id;
    const userAuth = new UserAuth(userInfo);
    return Promise.all([user.save(), userAuth.save()]);
  };

  UserAuth.checkDuplicate(userInfo.email, 'email')
        .then(saveUser)
        .then(results => {
          mailer.sendEmail(userInfo.email, 'create-user', {
            displayName: userInfo.displayName || userInfo.email
          });
          return res.send({
            data: results[0],
            code: '401001',
            messageInfo: ['User', 'sign up']
          });
        })
        .catch(next);
};

exports.passwordForgot = (req, res, next) => {
  let {path, email} = req.body;
  if (!email || !path) {
    return next(new APIError({code: '102001'}, 400));
  }
  let user;
  UserAuth.get(email, 'user')
        .then(userAuth => {
          user = userAuth.user;
          return UserToken.create(userAuth.user, 1);
        })
        .then(token => {
          let link = path + '?token=' + token.token;
          mailer.sendEmail(user.email, 'retrieve-password', {
            displayName: user.displayName || user.email,
            link: link
          });
          res.send({code: '403001', token: token.token});
        })
        .catch(next);
};

exports.confirmToken = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return next(new APIError({code: '102001'}, 400));
  }
  UserToken.validate(token) // get user-token
        .then(token => UserToken.create(token.user, 1))
        .then(token => res.send({
          code: '400000',
          token: token.token
        }))
        .catch(next);
};

exports.resetPassword = (req, res, next) => {
  const {token, password, confirmPassword} = req.body;

  if (!token || !password || !confirmPassword) {
    return next(new APIError({code: '102001'}, 400));
  }

  if (password !== confirmPassword) {
    return next({code: '101003'});
  }

  let modifyPassword = token => {
    return UserAuth.findOne({user: token.user})
            .then(userAuth => {
              userAuth.password = password;
              return userAuth.save();
            });
  };

  UserToken.validate(token)
        .then(modifyPassword)
        .then(() => res.send({
          code: '402003'
        }))
        .catch(next);
};

exports.changePassword = (req, res, next) => {
  const user = req.user,
    {oldPassword, newPassword, newConfirmPassword} = req.body;

  if (!oldPassword || !newPassword || !newConfirmPassword) {
    return next(new APIError({code: '102001'}, 400));
  }

  if (newPassword !== newConfirmPassword) {
    return res.send({code: '101005'});
  }

  if (!user.validatePassword(oldPassword)) {
    return res.send({code: '101002'});
  }

  let changePassword = () => {
    user.password = newPassword;
    return user.save();
  };

  let removeTokenAboutUser = user => {
    return OAuthToken.remove({user: user.user});
  };

  changePassword()
        .then(removeTokenAboutUser)
        .then(() => {
          mailer.sendEmail(user.email, 'change-password', {
            displayName: user.displayName || user.email,
            email: user.email
          });
          return res.send({
            code: '402002',
            messageInfo: ['change']
          });
        })
        .catch(next);
};

exports.changeWaitForConfirmEmail = (req, res, next) => {
  let user = req.user;
  let {path, newEmail, password} = req.body;

  if (!path || !newEmail || !password) {
    return next(new APIError({code: '102001'}, 400));
  }

  if (!user.validatePassword(password)) {
    return res.send({code: '101002'});
  }

  let sendEmail = token => {
    const link = path + '?token=' + token.token;
    mailer.sendEmail(user.email, 'update-email-confirm', {
      displayName: user.displayName || user.email,
      email: user.email,
      link: link
    });
    return res.send({code: '403001', token: token.token});
  };

  UserAuth.checkDuplicate({$or: [{email: newEmail}, {waitForConfirmEmail: newEmail}]}, 'email')
        .then(() => {
          user.waitForConfirmEmail = newEmail;
          return user.save();
        })
        .then(userAuth => UserToken.create(userAuth.user, 3))
        .then(sendEmail)
        .catch(next);
};

exports.changeEmailByToken = (req, res, next) => {
    // user type his/her email & password, then request for server
  if (!req.body.token) {
    return next(new APIError({code: '102001'}, 400));
  }
  let token = req.body.token;
  let changeEmail = token => {
    return UserAuth.get({user: token.user}, 'user')
            .then(userAuth => {
              console.log(userAuth);
              let user = userAuth.user;
              user.email = userAuth.waitForConfirmEmail;
              userAuth.email = userAuth.waitForConfirmEmail;
              userAuth.waitForConfirmEmail = '';
              return Promise.all([userAuth.save(), user.save()]);
            });
  };
  UserToken.validate({token: token, type: 3})
        .then(changeEmail)
        .then(results => {
          let email = results[0].email;
          mailer.sendEmail(email, 'email-changed', {
            displayName: results[0].displayName || email,
            email: email
          });
          return res.send({code: '403001'});
        })
        .catch(next);
};

exports.changeUsername = (req, res, next) => {
  let user = req.user;

  const {newUsername, password} = req.body;

  if (!newUsername || !password) {
    return next(new APIError({code: '102001'}, 400));
  }
  if (!user.validatePassword(password)) {
    return res.send({code: '101002'});
  }

  UserAuth.checkDuplicate(newUsername, 'username')
        .then(() => {
          user.username = newUsername;
          return user.save();
        })
        .then(user => {
          mailer.sendEmail(user.email, 'update-username-success', {
            username: user.username,
            displayName: user.displayName || user.email || user.username
          });
          return res.send({code: '403001'});
        })
        .catch(next);
};

exports.updateProfileImage = (req, res, next) => {
  let user = req.user;
  let profileImage = req.body.profileImage;

  if (!profileImage) {
    return next(new APIError({code: '102001'}, 400));
  }

  User.findByIdAndUpdate(user.user, {profileImage: profileImage})
        .then(() => {
          return res.send({code: '402002', messageInfo: ['profile image', 'update']});
        })
        .catch(next);
};
