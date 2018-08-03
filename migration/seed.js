'use strict';

require('dotenv').load();

const path = require('path'),
    mongoose = require('mongoose'),
    config = require(path.resolve('./config/config')),
    async = require('async'),
    dbUtils = require('./migUtils');

const addSeedUser = done => {
    const seedUsers = [
        {
            'password': 'default',
            'email': 'super@163.com',
            'displayName': 'super user',
            'firstName': 'super',
            'middleName': '',
            'lastName': 'user',
            'status': 1,
            'roles': [
                'superuser'
            ]
        },
        {
            'password': 'default',
            'email': 'admin@163.com',
            'displayName': 'admin user',
            'firstName': 'admin',
            'middleName': '',
            'lastName': 'user',
            'status': 1,
            'roles': [
                'staff'
            ]
        }
    ];

    const Staff = mongoose.model('auth');

    async.each(seedUsers, (seedUser, callback) => {
        Staff.findOne({email: seedUser.email}).exec((err, user) => {
            config.info(user);
            if (err) {
                config.error(err);
                callback(err);
            } else if (!user) {
                let superUser = new Staff(seedUser);
                superUser.save((err, user) => {
                    config.info(user.email);
                    callback(err);
                });
            } else {
                user.password = seedUser.password;
                user.displayName = seedUser.displayName;
                user.firstName = seedUser.firstName;
                user.middleName = seedUser.middleName;
                user.lastName = seedUser.lastName;
                user.roles = seedUser.roles;
                user.markModified('roles');
                user.save((err, user) => {
                    config.info(user.email);
                    callback(err);
                });
            }
        });
    }, (err) => {
        if (err) return done(err, null);
        return done();
    });
};

const addEmailTemplates = done => {
    const copyright = config.copyright,
        EmailTemplate = mongoose.model('emailTemplate'),
        mailTemplates = require('./emails.json');

    const titles = [];
    mailTemplates.forEach(function (item) {
        titles.push(item.title);
    });

    const saveItem = function (item, callback) {
        const emailTemplate = new EmailTemplate(item);
        emailTemplate.save((err, newEmailTemplate) => {
            console.log('save mail template:' + newEmailTemplate.name);
            callback(err, newEmailTemplate);
        });
    };

    const finish = function (err) {
        if (err) console.log(err);
        console.log('save mail template finished');
        done(err);
    };

    EmailTemplate.remove({title: {$in: titles}}, function (err) {
        if (err) return done(err);
        async.map(mailTemplates, saveItem, finish);
    });
};

const addDefaultMenu = (done) => {
    const Config = mongoose.model('sysConfig');
    Config.findOne({'name': 'system-menu'}).exec((err, sysConfig) => {
        config.info(sysConfig);
        if (err) {
            config.error(err);
            done(err);
        } else if (!sysConfig) {
            sysConfig = new Config({'name': 'system-menu', 'option': JSON.stringify(require('./config.json'))});

            sysConfig.save((err, result) => {
                config.info(result.option);
                done(err);
            });
        } else {
            sysConfig.option = JSON.stringify(require('./config.json'));
            sysConfig.save((err, result) => {
                config.info(result.option);
                done(err);
            });
        }
    });
};

const addDefaultMessages = (done) => {
    const Message = mongoose.model('message'),
        seedMessages = require('./messages.json');

    async.each(seedMessages, (seedMessage, callback) => {
        Message.findOne({code: seedMessage.code}).exec((err, message) => {
            if (err) {
                config.error(err);
                callback(err);
            } else if (!message) {
                let messageModel = new Message(seedMessage);

                messageModel.save((err, result) => {
                    config.info(result.code);
                    callback(err);
                });
            } else {
                message.content = seedMessage.content;
                message.clients = seedMessage.clients;
                message.type = seedMessage.type;
                message.save((err, result) => {
                    config.info(result.code);
                    callback(err);
                });
            }
        });
    }, (err) => {
        if (err) return done(err, null);
        return done();
    });
};

const tasks = [addSeedUser, addEmailTemplates, addDefaultMenu, addDefaultMessages];

dbUtils.execMigrationTasks(tasks);
