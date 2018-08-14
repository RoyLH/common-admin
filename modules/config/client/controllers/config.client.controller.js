(function () {
    'use strict';

    angular
        .module('config')
        .controller('ConfigController', ConfigController)
        .controller('MenuModalController', MenuModalController);

    ConfigController.$inject = ['$rootScope', '$scope', 'ConfigService', '$uibModal', 'Notification'];

    function ConfigController($rootScope, $scope, ConfigService, $modal, Notification) {
        var vm = this;
        vm.initConfig = refresh;
        vm.menuOperation = {
            deleteMenu: deleteMenu,
            showModal: showMenuModal,
            changeRoles: operateMenuRoles,
            changeDefault: changeDefaultMenu,
            changeVisible: operateMenuVisible,
            changeMenuPosition: changeMenuPosition
        };
        vm.menusSortConfig = {
            handleClass: 'glyphicon-menu-hamburger',
            orderChanged: changeMenuOrder

        };

        function refresh() {
            ConfigService.query(function (sysConfigs) {
                vm.sysConfigs = sysConfigs;
                vm.sysConfigs.some(function (config) {
                    if (config.name === 'system-menu') {
                        vm.menuConfig = config;
                        vm.menus = JSON.parse(config.option);
                        return true;
                    }

                    return false;
                });
            });
        }

        function saveConfig(config) {
            config.$update(function () {
                $rootScope.refreshConfig();
                refresh();
            });
        }

        var menuActions = {
            create: {
                templateURL: '/menu_form',
                controller: 'MenuModalController',
                backdrop: 'static',
                title: 'NEW_MENU',
                name: 'CREATE',
                action: addMenu
            },
            update: {
                templateURL: '/menu_form',
                controller: 'MenuModalController',
                backdrop: 'static',
                title: 'UPDATE_MENU',
                name: 'UPDATE',
                action: updateMenu
            }
        };

        function addMenu(menu) {
            menu.roles = ['superuser'];
            menu.order = vm.menus.length;
            menu.topBar = false;
            vm.menus.push(menu);
            vm.menuConfig.option = JSON.stringify(vm.menus);
            saveConfig(vm.menuConfig);
        }

        function updateMenu(newMenuObj) {
            vm.menus.some(function (menu) {
                if (menu.state === newMenuObj.state) {
                    menu = updateMenu;
                    return true;
                } else {
                    return false;
                }
            });
            vm.menuConfig.option = JSON.stringify(vm.menus);
            saveConfig(vm.menuConfig);
        }

        function deleteMenu(menuObj) {
            Notification.confirm('202001', [menuObj.name], function () {
                var menus = [];
                vm.menus.forEach(function (menu) {
                    if (menu.state !== menuObj.state) {
                        menus.push(menu);
                    }
                });
                vm.menuConfig.option = JSON.stringify(menus);
                saveConfig(vm.menuConfig);
            });
        }

        function showMenuModal(currentAction, data) {
            var modalInstance = $modal.open({
                templateUrl: menuActions[currentAction].templateURL,
                controller: menuActions[currentAction].controller,
                backdrop: 'static',
                resolve: {
                    menu: data,
                    currentAction: menuActions[currentAction]
                }
            });
            modalInstance.result.then(function (menu) {
                menuActions[currentAction].action(menu);
            });
        }

        function operateMenuRoles(menu, role) {
            if (menu.roles.indexOf(role) > -1) {
                menu.roles.splice(menu.roles.indexOf(role));
            } else {
                menu.roles.push(role);
            }
            updateMenu(menu);
        }

        function changeDefaultMenu(currentMenu) {
            vm.menus.forEach(function (menu) {
                menu.isDefault = menu.state === currentMenu.state;
            });
            vm.menuConfig.option = JSON.stringify(vm.menus);
            saveConfig(vm.menuConfig);
        }

        function operateMenuVisible(menu) {
            menu.mobile = !menu.mobile;
            updateMenu(menu);
        }

        function changeMenuPosition(menu) {
            menu.topBar = !menu.topBar;
            updateMenu(menu);
        }

        function changeMenuOrder(event) {
            vm.menus[event.source.index].order = event.source.index;
            vm.menus[event.dest.index].order = event.dest.index;
            vm.menuConfig.option = JSON.stringify(vm.menus);

            saveConfig(vm.menuConfig);
        }
    }

    MenuModalController.$inject = ['$scope', '$state', '$uibModalInstance', 'menu', 'currentAction'];

    function MenuModalController($scope, $state, $modalInstance, menu, currentAction) {
        $scope.routeStates = $state.get();
        $scope.currentAction = currentAction;
        $scope.menu = menu || {};
        $scope.saveMenu = function () {
            $modalInstance.close($scope.menu);
        };
    }

}());
