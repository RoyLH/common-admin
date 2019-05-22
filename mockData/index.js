'use strict';

const config = require('../config/config'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  _ = require('lodash'),
  contents = fs.readFileSync('mockData/mockData.json'),
  data = JSON.parse(contents),
  requestData = data.requests;

exports.requests = requestData;

exports.authorization = 'Basic ' + new Buffer(requestData.clients[0].clientID + ':' + requestData.clients[0].clientSecret).toString('base64');

exports.cleanAllData = () => {
  console.log('Host: ' + mongoose.connection.host);
  console.log('DB Name: ' + mongoose.connection.name);
  const len = Object.keys(mongoose.connection.collections).length;
  if (len === 0) {
    console.log('collections empty');
    console.log('Delete DB Finished');
    return Promise.resolve();
  } else {
    let tasks = [];
    for (let i of mongoose.connection.collections) {
      tasks.push(mongoose.connection.collections[i].remove());
    }
    console.log('Delete DB Finished');
    return Promise.all(tasks);
  }
};

exports.initData = (model, data) => {
  const Model = mongoose.model(model);
  if (_.isArray(data)) {
    if (model !== 'auth' && model !== 'user' && model !== 'staff') {
      return Model.insertMany(data);
    } else {
      return Promise.all(data.map(itemInfo => {
        let item = new Model(itemInfo);
        return item.save();
      }));
    }
  } else {
    data = new Model(data);
    return data.save();
  }
};

exports.initDB = () => {
  return this.cleanAllData()
        .then(() => {
          return Promise.all([
            this.initData('auth', requestData.user.super).then(results => {
              this.superusers = results;
              return Promise.resolve();
            }),
            this.initData('staff', requestData.user.admin).then(results => {
              this.superusers = results;
              return Promise.resolve();
            }),
            this.initData('user', requestData.user.user).then(results => {
              this.superusers = results;
              return Promise.resolve();
            }),
            this.initData('client', requestData.clients).then(results => {
              this.superusers = results;
              return Promise.resolve();
            }),
            this.initData('sysConfig', requestData.sysConfigs).then(results => {
              this.superusers = results;
              return Promise.resolve();
            }),
            this.initData('emailTemplate', requestData.emailTemplates).then(results => {
              this.emailTemplates = results;
              return Promise.resolve();
            })
          ]);
        });
};

exports.loginSuperuser = (api, done) => {
  this.initDB().then(() => {
    const superUser = data.requests.user.super[0];
    api.post('/app/auth/signin')
            .set('Content-Type', 'application/json')
            .send({
              email: superUser.email,
              password: 'default'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
  }).catch(console.log);
};

exports.loginAdmin = (api, done) => {
  this.initDB().then(() => {
    const adminUser = data.requests.users.admin[0];
    api.post('/app/auth/signin')
            .set('Content-Type', 'application/json')
            .send(adminUser)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
  }).catch(console.log);
};

exports.loginUser = (api, done) => {
  this.initDB().then(() => {
    const user = data.requests.users.user[0];
    const loginInfo = {
      client_id: data.requests.clients[0].clientID,
      client_secret: data.requests.clients[0].clientSecret,
      grant_type: 'password',
      username: user.email,
      password: user.password
    };
    api.post('/oauth/token')
            .set('Content-Type', 'application/json')
            .send(loginInfo)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
  }).catch(console.log);
};

exports.logoutUser = function (api, done) {
  const _this = this;
  api.get('/app/auth/signout')
        .set('Content-Type', 'application/json')
        .expect(302)
        .end(err => {
          if (err) {
            return done(err);
          } else {
            _this.cleanAllData().then(() => {
              console.log('the test finish!');
              return done();
            });
          }
        });
};
