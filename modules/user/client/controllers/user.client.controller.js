(function () {
    'use strict';
    angular
    .module('user')
    .controller('UsersController', UsersController)
    .controller('UserModalController', UserModalController);

    UsersController.$inject = ['$uibModal', 'UserService', 'Notification'];
    function UsersController($modal, UserService, Notification) {
        var vm = this;

        vm.pageOptions = {
            page: 1,
            limit: 20
        };
        vm.userActions = {
            'add': {
                text: 'Add',
                tpl: '/add_user_form',
                form: '#add_user_form',
                title: 'Add New Staff',
                action: addUser
            },
            'update': {
                text: 'Update',
                tpl: '/add_user_form',
                form: '#modify_user_form',
                title: 'Modify Staff Details',
                action: updateUser
            },
            'deactivate': {
                text: 'Deactivate',
                tpl: '/deactivate_user_form',
                form: '#deactivate_user_form',
                title: 'Deactivate Staff',
                action: changeUserStatus
            },
            'activate': {
                text: 'Activate',
                tpl: '/deactivate_user_form',
                form: '#deactivate_user_form',
                title: 'Activate Staff',
                action: changeUserStatus
            }
        };

        vm.resetPage = resetPage;
        vm.refreshUser = refreshUser;
        vm.selectUser = selectUser;
        vm.showUserModal = showUserModal;
        vm.addUser = addUser;
        vm.updateUser = updateUser;
        vm.changeUserStatus = changeUserStatus;
        vm.deleteUser = deleteUser;
        vm.resetPassword = resetPassword;

        function resetPage() {
            vm.pageOptions.page = 1;
        }

        function refreshUser() {
            var queryOptions = {
                page: vm.pageOptions.page,
                limit: vm.pageOptions.limit,
                searchText: vm.searchText,
                roles: 'user'
            };
            UserService.paginate(queryOptions, function (data, headers) {
                vm.totalItemsCount = data.total;
                vm.users = data.docs;
                if (!vm.users) {
                    return;
                }
            });
        }

        function selectUser(item, action) {
            if (item) {
                vm.currentUser = angular.copy(item);
            } else {
                vm.currentUser = {};
            }
            vm.currentUserAction = vm.userActions[action];
            vm.showUserModal();
        }

        function showUserModal() {
            var modalInstance = $modal.open({
                templateUrl: '/user_modal',
                controller: 'UserModalController',
                controllerAs: 'vm',
                resolve: {
                    currentUserAction: function () {
                        return vm.currentUserAction;
                    },
                    user: function () {
                        return vm.currentUser;
                    }
                },
                backdrop: 'static'
            });
            modalInstance.result.then(function (user) {
                vm.currentUserAction.action(user);
            });
        }

        function addUser(userObj) {
            if (userObj === null) {
                return;
            }
            var user = new UserService(userObj);
            user.$save(function (res) {
                refreshUser();
            });
        }

        function updateUser(userObj) {
            if (userObj === null) return;
            var updateInfo = {
                firstName: userObj.firstName,
                middleName: userObj.middleName,
                lastName: userObj.lastName,
                roles: userObj.roles
            };
            UserService.update({ userId: userObj._id }, updateInfo, function (res) {
                refreshUser();
            });
        }

        function changeUserStatus(userObj) {
            if (userObj === null) return;
            UserService.update({ userId: userObj._id }, {
                action: 'status',
                active: userObj.status === -1 || userObj.status === 2
            }, function (res) {
                refreshUser();
            });
        }

        function deleteUser(userObj) {
            if (userObj === null || userObj.status === 1) return;
            Notification.confirm('202001', [userObj.email], function () {
                var user = new UserService(userObj);
                user.$remove(function (res) {
                    refreshUser();
                });
            });
        }

        function resetPassword(userObj) {
            if (userObj === null || userObj.status === -1) return;
      // $scope.showConfirmMessage('CMSV_PASS_RESET_CONFIRM', {}, function () {
            UserService.passwordReset.query({ userId: userObj._id }, function (res) {
                refreshUser();
            });
      // });
        }
    }

    UserModalController.$inject = ['$uibModalInstance', 'currentUserAction', 'user', 'Authentication'];
    function UserModalController($modalInstance, currentUserAction, user, authentication) {

        var vm = this;

        vm.user = user;
        vm.current = {};
        vm.currentUserAction = currentUserAction;
        vm.operateUser = operateUser;

        if (vm.user.changeReason !== '') {
            vm.user.changeReason = '';
        }

        function operateUser() {
            vm.current = {};
            vm.user.roles = ['user'];
            $modalInstance.close(vm.user);
        }
    }
}());
