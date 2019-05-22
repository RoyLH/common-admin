(function () {
  'use strict';

  angular
    .module('message')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard.message', {
        url: 'dashboard/message',
        controller: 'MessagesController',
        templateUrl: '/modules/message/client/views/message.client.view.html',
        controllerAs: 'vm',
        resolve: {
          messageResolve: newMessage
        },
        data: {
          roles: ['admin', 'superuser'],
          pageTitle: 'Edit Message {{ messageResolve.name }}'
        }
      });
  }

    // todo
  getMessage.$inject = ['$stateParams', 'MessagesService'];

  function getMessage($stateParams, MessagesService) {
    return MessagesService.get({
      messageId: $stateParams.messageId
    }).$promise;
  }

  newMessage.$inject = ['MessagesService'];

  function newMessage(MessagesService) {
    return new MessagesService();
  }
}());
