(function () {
  'use strict';

  angular
    .module('auth')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$state', 'Authentication'];

  function AuthenticationController($state, Authentication) {
    var vm = this;
    vm.currentAction = 'login';
    vm.authentication = Authentication;
    vm.user = {};

    vm.templates = {
      'login': {
        tpl: '/login_form',
        form: '#login_form',
        title: 'User Authentication'
      },
      'first': {
        tpl: '/firstlogin_form',
        form: '#firstlogin_form',
        title: 'Change Password'
      }
    };

    vm.changepass = {};

    vm.changeAction = function (action) {
      vm.errorMessage = null;
      vm.user = {};
      vm.changepass = {};
      vm.currentAction = action;
    };

    vm.submit = function (event) {
      if (event.keyCode === 13) {
        if (vm.currentAction === 'first') {
          vm.changePassword();
        } else {
          vm.login();
        }
      }
    };

    vm.login = function () {
      Authentication.login(vm.user).then(function (result) {
        var user = result.data;
        if (!user) return;

        vm.authentication.user = user;

        if (user.status === 0) {
          vm.currentAction = 'first';
        } else {
          $state.go($state.previous.state.name || 'dashboard', $state.previous.params);
        }
      });
    };

    vm.changePassword = function () {
      Authentication.changePassword(vm.changepass, vm.authentication.user._id).then(function (result) {
        if (!result) return;
        vm.changepass = {};
        vm.user = {};
        vm.currentAction = 'login';
      });
    };
  }
}());
