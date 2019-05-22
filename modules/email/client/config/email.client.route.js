(function () {

  'use strict';

  angular.module('email')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider.state('dashboard.email', {
      url: 'email',
      templateUrl: '/modules/email/client/views/email.client.view.html',
      controller: 'EmailController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'email',
        roles: ['superuser', 'admin']
      }
    });
  }

}());
