(function () {
  'use strict';

  angular.module('files')
        .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
            .state('dashboard.files', {
              url: 'dashboard/files',
              templateUrl: '/modules/file/client/views/files.client.view.html',
              controller: 'FilesController',
              controllerAs: 'vm',
              data: {
                pageTitle: 'Files',
                roles: ['superuser', 'admin']
              }
            });
  }
}());
