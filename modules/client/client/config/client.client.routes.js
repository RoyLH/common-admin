(function () {
    'use strict';

    // Setting up date
    angular
        .module('client')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard.client', {
                url: 'dashboard/client',
                templateUrl: '/modules/client/client/views/client.client.view.html',
                controller: 'ClientController',
                data: {
                    pageTitle: 'Dashboard-Client',
                    roles: ['superuser', 'admin']
                }
            });
    }
}());
