(function () {
    'use strict';
    angular
        .module('staff')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard.staff', {
                url: 'dashboard/staff',
                templateUrl: '/modules/staff/client/views/staff.client.view.html',
                controller: 'StaffController',
                controllerAs: 'vm',
                data: {
                    roles: ['admin', 'superuser']
                }
            });
    }
}());
