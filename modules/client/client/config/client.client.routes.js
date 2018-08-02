(function () {
    'use strict';

    angular
        .module('client')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard.client', {
                url: 'dashboard/client',
                template: '/modules/client/client/views/client.client.view.html',
                controller: 'ClientController',
                data: {
                    pageTitle: 'Dashboard-Client',
                    roles: ['superuser', 'admin']
                }
            });
    }
}());