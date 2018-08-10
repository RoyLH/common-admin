(function () {
    'use strict';

    angular
    .module('feedback')
    .service('Logger', ['$injector', function ($injector) {
        function sendFeedback(name, comments, level) {

            var FeedbacksService = $injector.get('FeedbacksService');
            return new FeedbacksService({
                feedbackName: name,
                level: level,
                comments: comments
            }).$save();
        }

        return {
            log: function (name, comments, level) {
                sendFeedback(name, comments, level);
            },
            debug: function (name, comments) {
                sendFeedback(name, comments, 1);
            },
            info: function (name, comments) {
                sendFeedback(name, comments, 2);
            },
            warn: function (name, comments) {
                sendFeedback(name, comments, 3);
            },
            error: function (name, comments) {
                sendFeedback(name, comments, 4);
            }
        };
    }])
    .factory('$exceptionHandler', ['Logger', function (Logger) {
        return function (exception, cause) {
            var feedbackMessage = exception.message + '\n' + exception.stack + '\n' + cause;
            feedbackMessage += '\nuser agent:' + navigator.userAgent;
            feedbackMessage += '\nlocation:' + location.href;
            Logger.error('angular-exception', feedbackMessage);
            console.error(feedbackMessage);
        };
    }]);
}());
