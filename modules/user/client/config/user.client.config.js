(function () {
  'use strict';

  angular
        .module('user')
        .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider.state('dashboard.user', {
      url: 'dashboard/user',
      templateUrl: '/modules/user/client/views/user.client.view.html',
      controller: 'UsersController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Dashboard-Users Users',
        roles: ['user', 'admin', 'superuser']
      }
    });
  }
}());
