(function () {
  'use strict';

  angular
    .module('message')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    var Messages = $resource('app/messages/:messageId', {
      messageId: '@_id'
    }, {
      paginate: {
        method: 'GET',
        url: 'app/messages/'
      },
      update: {
        method: 'PUT'
      },
      import: {
        method: 'POST',
        url: '/app/messages/import'
      }
    });
    angular.extend(Messages, {
      importJSON: function (messages) {
        return this.import(messages).$promise;
      }
    });
    return Messages;
  }
}());
