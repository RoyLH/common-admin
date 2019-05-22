'use strict';

const path = require('path'),
  mongoose = require('mongoose'),
  Feedback = mongoose.model('feedback'),
  responseHandler = require(path.resolve('./config/lib/response')),
  _ = require('lodash');

/**
 * Create a Feedback
 */
exports.create = function (req, res, next) {
  let commentString = ''; // req.body.comments;
  if (typeof req.body.comments === 'object') {
    for (let key of Object.keys(req.body.comments)) {
      commentString += key + ': ' + req.body.comments[key] + '\n';
    }
  } else {
    commentString = req.body.comments;
  }

  let feedback = new Feedback({
    feedbackName: req.body.feedbackName,
    comments: commentString,
    level: req.body.level
  });
  feedback.clientName = (req.clientPortal ? req.clientPortal.clientName : 'admin');
  feedback.save()
        .then(feedback => res.send({
          code: '402001',
          messageInfo: ['Feedback', feedback.feedbackName]
        }))
        .catch(next);
};

/**
 * Show the current Feedback
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
  let feedback = req.feedback ? req.feedback.toJSON() : {};

  return res.send({
    code: '400000',
    data: feedback
  });
};

/**
 * Update a Feedback
 */
exports.update = function (req, res, next) {
  let feedback = req.feedback;

  feedback = _.extend(feedback, req.body);

  feedback.save(err => {
    if (err) {
      return next(err);
    } else {
      return res.send(responseHandler.getResponseData({
        code: '402002',
        messageInfo: ['Feedback', feedback.feedbackName]
      }));
    }
  });
};

/**
 * Delete an Feedback
 */
exports.delete = function (req, res, next) {
  let feedback = req.feedback;

  feedback.remove(err => {
    if (err) {
      return next(err);
    } else {
      return res.send({
        code: '402003',
        messageInfo: ['Feedback', feedback.feedbackName]
      });
    }
  });
};

/**
 * List of Feedbacks
 */
exports.list = function (req, res, next) {
  let query = req.query.level ? {
    level: parseInt(req.query.level, 10)
  } : {};
  let options = {
    sort: {
      created: -1
    },
    page: req.query.page || 1,
    limit: parseInt(req.query.limit, 10) || 15
  };
  Feedback.paginate(query, options, (err, feedbacks) => {
    if (err) {
      return next(err);
    } else {
      return res.send({
        code: '400000',
        data: feedbacks
      });
    }
  });
};

/**
 * Feedback middleware
 */
exports.feedbackByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      code: '102001',
      messageInfo: {
        param: 'id'
      }
    });
  }

  Feedback.findById(id).exec((err, feedback) => {
    if (err) {
      return next(err);
    } else if (!feedback) {
      return res.status(404).send({
        code: '404'
      });
    }
    req.feedback = feedback;
    next();
  });
};
