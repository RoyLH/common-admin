(function () {
  'use strict';

  angular
        .module('localization')
        .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
            .state('dashboard.localization', {
              url: 'dashboard/localization',
              controller: 'LanguageAnchorsController',
              controllerAs: 'vm',
              templateUrl: '/modules/localization/client/views/language-anchors.client.view.html',
              data: {
                pageTitle: 'Edit Language anchor'
              }
            });
  }
}());
