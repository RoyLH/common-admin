const mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('user');

module.exports.list = (req, res, next) => {
    let query = req.query.level ? {level: parseInt(req.query.level, 10)} : {};
    let options = {
        sort: {created: -1},
        page: req.query.page || 1,
        limit: parseInt(req.query.limit, 10) || 15
    };
    User.paginate(query, options, (err, users) => {
        if (err) return next(err);
        return res.send({code: '400000', data: users});
    });
};

module.exports.read = (req, res, next) => {
    let user = req.model;
    return res.send({code: '400000', data: user});
};

module.exports.update = (req, res, next) => {
    let user = req.model;
    let newUserInfo = req.body;
    _.merge(user, _.pick(newUserInfo, ['firstName', 'lastName', 'gender']));

    user.save()
        .then(newUser => res.send({
            code: '402002',
            messageInfo: ['Your basic info']
        }))
        .catch(next);
};

module.exports.delete = (req, res, next) => {
    let user = req.model;
    user.remove()
        .then(() => res.send({
            code: '402003'
        }));
};

module.exports.userById = (req, res, next, userId) => {
    User.findById(userId)
        .then(user => {
            req.model = user;
            next();
        })
        .catch(next);
};
