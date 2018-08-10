(function () {
    'use strict';

    angular
    .module('feedback')
    .factory('FeedbacksService', FeedbacksService);

    FeedbacksService.$inject = ['$resource'];

    function FeedbacksService($resource) {
        var Feedback = $resource('app/feedbacks/:feedbackId', {
            feedbackId: '@_id'
        }, {
            save: {
                method: 'POST',
                headers: {'background': 'true'}
            },
            paginate: {
                method: 'GET',
                url: 'app/feedbacks'
            }
        });

        return Feedback;
    }
}());
