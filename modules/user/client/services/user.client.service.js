(function () {
    'use strict';

    angular
    .module('user')
    .factory('UserService', UserService);

    UserService.$inject = ['$resource'];

    function UserService($resource) {

        var Users = $resource('/app/users/:userId/:action', {userId: '@_id', action: '@action'}, {
            update: {
                method: 'put'
            },
            paginate: {
                method: 'GET',
                url: 'app/users'
            },
            resetPassword: {
                method: 'GET',
                url: '/app/users/:userId/password'
            }
        });

        angular.extend(Users, {
            passwordReset: function (userId) {
                return this.resetPassword(userId).$promise;
            }
        });

        return Users;
    }
}());
