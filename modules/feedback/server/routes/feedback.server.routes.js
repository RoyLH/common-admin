'use strict';

const path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    feedbacks = require('../controllers/feedbacks.server.controller');

module.exports = (app) => {
    app.route('/app/feedbacks').all(authHelper.isAllowed)
        .post(feedbacks.create)
        .get(feedbacks.list);

    app.route('/app/feedbacks/:feedbackId').all(authHelper.isAllowed)
        .get(feedbacks.read)
        .put(feedbacks.update)
        .delete(feedbacks.delete);

    app.param('feedbackId', feedbacks.feedbackByID);
};
