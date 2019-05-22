(function () {
  'use strict';

    // Authentication service for user variables

  angular
        .module('auth')
        .factory('Authentication', Authentication);

  Authentication.$inject = ['$window', '$http'];

  function Authentication($window, $http) {
    return {
      user: $window.user,
      login: function (user) {
        return $http.post('/app/auth/signin', user);
      },
      changePassword: function (passwords) {
        return $http.put('/app/auth/password', passwords);
      }
    };
  }
}());
