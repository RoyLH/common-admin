(function (params) {
    'use strict';

    angular
        .module('cache')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard.cache', {
                url: 'dashboard/cache',
                controller: 'CachesController',
                controllerAs: 'vm',
                templateUrl: '/modules/cache/client/views/caches.client.view.html',
                data: {
                    pageTitle: 'Edit cache'
                }
            });
    }
}());
