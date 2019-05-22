'use strict';

const path = require('path'),
  config = require(path.resolve('./config/config'));

module.exports = (app, db) => {
  config.login = {
    isAllowMuti: process.env.IS_ALLOW_MUTI_LOGIN || true,
    isAllowMutiClientLogin: process.env.IS_ALLOW_MUTI_CLIENT_LOGIN || true
  };
  config.token = {
    tokenLife: parseInt(process.env.TOKEN_LIFE, 10) || 60 * 60 * 1000,
    userTokenLife: parseInt(process.env.USER_TOKEN_LIFE, 10) || 5 * 60 * 1000, // 5 Minutes  5 * 60 * 1000
    userRefreshTokenShortLife: parseInt(process.env.USER_REFRESH_TOKEN_SHORT_LIFE, 10) || 24 * 60 * 60 * 1000, // 24 hours 24*60*60*1000
    userRefreshTokenLongLife: parseInt(process.env.USER_REFRESH_TOKEN_LONG_LIFE, 10) || 10 * 24 * 60 * 60 * 1000 // ten days 10*24*60*60*1000
  };
};
