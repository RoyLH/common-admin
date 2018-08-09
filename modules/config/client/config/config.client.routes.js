(function () {
    'use strict';

    angular
        .module('config')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard.config', {
                url: 'dashboard/config',
                templateUrl: '/modules/config/client/views/config.client.view.html',
                controller: 'ConfigController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Dashboard-Config',
                    roles: ['superuser']
                }
            });
    }
}());