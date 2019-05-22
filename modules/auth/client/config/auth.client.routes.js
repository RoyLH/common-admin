(function () {
  'use strict';

  angular
        .module('auth')
        .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
        // Users state routing
    $stateProvider
            .state('authentication', {
              abstract: true,
              url: '/authentication',
              template: '<ui-view/>'
            })
            .state('authentication.signin', {
              url: '/login',
              controller: 'AuthenticationController',
              controllerAs: 'vm',
              templateUrl: '/modules/auth/client/views/index.client.view.html',
              data: {
                pageTitle: 'Signin'
              }
            })
            .state('dashboard.password', {
              url: 'dashboard/password',
              controllerAs: 'vm',
              templateUrl: '/modules/auth/client/views/change-password.client.view.html',
              controller: 'ChangePasswordController',
              data: {
                pageTitle: 'Change Password'
              }
            });
  }
}());
