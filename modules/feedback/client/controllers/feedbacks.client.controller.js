(function () {
  'use strict';

    // Feedbacks controller
  angular
        .module('feedback')
        .controller('FeedbacksController', FeedbacksController);

  FeedbacksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'FeedbacksService', 'Notification'];

  function FeedbacksController($scope, $state, $window, Authentication, FeedbacksService, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.levels = [
            {name: 'ERROR', value: 4},
            {name: 'WARNING', value: 3},
            {name: 'LOG', value: 2},
            {name: 'INFO', value: 1}
    ];
    vm.options = {
      limit: 15,
      page: 1
    };
    vm.remove = remove;
    vm.init = init;

    function init() {
      FeedbacksService.paginate(vm.options, function (feedback) {
        var feedbackList = feedback.docs;
        feedbackList.forEach(function (item) {
          var commentList = item.comments.split(/\n/);
          item.shortComments = commentList[0];
          item.comments = commentList.join('<br>');
        });
        vm.feedback = feedback;
      });
    }

        // Remove existing Feedback
    function remove(feedback) {
      Notification.confirm('202001', [feedback.feedbackName], function () {
        new FeedbacksService(feedback).$remove(init);
      });
    }
  }
}());
