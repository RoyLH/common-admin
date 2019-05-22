(function () {
  'use strict';

  angular
        .module('auth')
        .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$state', 'Authentication'];

  function ChangePasswordController($scope, $state, Authentication) {
    var vm = this;
    vm.passwords = {};

    vm.changePassword = function () {
      Authentication.changePassword(vm.passwords).then(function () {
        $state.go('authentication.signin');
      });
    };

    vm.reset = function () {
      $scope.changePwdForm.$setPristine();
      vm.passwords = {};
    };
  }
}());
