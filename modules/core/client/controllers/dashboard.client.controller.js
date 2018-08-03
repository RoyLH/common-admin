(function () {
    'use strict';

    angular
        .module('core')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope', '$window', '$state', 'ConfigService', 'Authentication', 'Socket', 'Notification'];

    function DashboardController($rootScope, $window, $state, ConfigService, Authentication, Socket, Notification) {
        var vm = this;

        vm.auth = Authentication.user;
        vm.menus = [];
        vm.verticalMenu = false;
        vm.init = init;
        vm.changeScreenStatus = changeScreenStatus;
        vm.goDefaultMenu = goDefaultMenu;
        vm.mainTitle = $window.config.title || 'CommonService';

        $rootScope.refreshConfig = init;

        function init() {
            vm.menus = [];

            vm.fullScreen = (!localStorage.getItem('screenStatus') || localStorage.getItem('screenStatus') === 'true');

            ConfigService.query(function (result) {
                var allState = $state.get();
                var validMenus = allState.map(function (state) {
                    return state.name;
                });
                result.some(function (config) {
                    if (config.name === 'system-menu') {
                        var menus = JSON.parse(config.option);
                        menus.forEach(function (menu) {
                            if (validMenus.indexOf(menu.state) > -1
                                && (vm.auth.roles.indexOf('superuser') > -1 || ((vm.auth.roles.indexOf('admin') > -1) && (menu.roles.indexOf('admin') > -1)))) {
                                vm.menus.push(menu);
                                if (!menu.topBar && !vm.verticalMenu) {
                                    vm.verticalMenu = true;
                                }
                                if (menu.isDefault) {
                                    vm.defaultMenuState = menu.state;
                                }
                            }
                        });
                        return true;
                    }

                    return false;
                });

                if (!Socket.socket) {
                    Socket.connect();
                }

                // Add an event listener to the 'message' event
                Socket.on('message', function (message) {
                    Notification.show(message.code, message.messageInfo);
                });

                vm.defaultMenuState = vm.defaultMenuState || vm.menus[0].state;
                if ($state.current.name === 'dashboard') {
                    goDefaultMenu();
                }
            });
        }

        function changeScreenStatus() {
            vm.fullScreen = !vm.fullScreen;
            localStorage.setItem('screenStatus', vm.fullScreen);
        }

        function goDefaultMenu() {
            $state.go(vm.defaultMenuState);
        }
    }
}());
