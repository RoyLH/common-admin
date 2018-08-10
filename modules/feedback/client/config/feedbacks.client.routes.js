(function () {
    'use strict';

    angular
    .module('feedback')
    .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
      .state('dashboard.feedback', {
          url: 'dashboard/feedback',
          controller: 'FeedbacksController',
          templateUrl: '/modules/feedback/client/views/feedback.client.view.html',
          controllerAs: 'vm',
          resolve: {
              feedbackResolve: newFeedback
          },
          data: {
              roles: ['superuser']
          }
      });
    }

    getFeedback.$inject = ['$stateParams', 'FeedbacksService'];

    function getFeedback($stateParams, FeedbacksService) {
        return FeedbacksService.get({
            feedbackId: $stateParams.feedbackId
        }).$promise;
    }

    newFeedback.$inject = ['FeedbacksService'];

    function newFeedback(FeedbacksService) {
        return new FeedbacksService();
    }
}());
