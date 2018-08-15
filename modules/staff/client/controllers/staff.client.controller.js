(function name(params) {
    'use strict';

    angular
        .module('staff')
        .controller('StaffController', StaffController)
        .controller('StaffModalController', StaffModalController);

    StaffController.$inject = ['$uibModal', 'StaffService', 'Authentication', 'Notification'];

    function StaffController($modal, StaffService, Authentication, Notification) {
        var vm = this;
        vm.authentication = Authentication;
        vm.refreshStaff = refreshStaff;
        vm.selectStaff = selectStaff;
        vm.showStaffModal = showStaffModal;
        vm.addStaff = addStaff;
        vm.updateStaff = updateStaff;
        vm.changeStatus = changeStatus;
        vm.deleteStaff = deleteStaff;
        vm.resetPassword = resetPassword;
        vm.resetPage = resetPage;
        vm.pageOptions = {
            page: 1,
            limit: 20
        };

        var staffActions = {
            'add': {
                text: 'Add',
                tpl: '/add_staff_form',
                form: '#add_staff_form',
                title: 'Add New Staff',
                action: addStaff
            },
            'update': {
                text: 'Update',
                tpl: '/add_staff_form',
                form: '#add_staff_form',
                title: 'Modify Staff Details',
                action: updateStaff
            },
            'deactivate': {
                text: 'Deactivate',
                tpl: '/deactivate_staff_form',
                form: '#deactivate_staff_form',
                title: 'Deactivate Staff',
                action: changeStatus
            },
            'activate': {
                text: 'Activate',
                tpl: '/deactivate_staff_form',
                form: '#deactivate_stuff_form',
                title: 'Activate Staff',
                action: changeStatus
            }
        };

        function refreshStaff() {
            var queryOptions = {
                page: vm.pageOptions.page,
                limit: vm.pageOptions.limit,
                searchText: vm.searchText,
                roles: 'staff'
            };
            StaffService.paginate(queryOptions, function (data, headers) {
                vm.totalItemsCount = headers()['x-total-items-count'];
                vm.staffs = data.docs;
                if (!vm.staffs) return;
            });
        }

        function selectStaff(item, action) {
            if (item) {
                vm.backupStaff = item;
                vm.currentStaff = angular.copy(item);
            } else {
                vm.currentStaff = {};
            }
            vm.currentStaffAction = staffActions[action];
            vm.showStaffModal();
        }

        function showStaffModal() {
            var modalInstance = $modal.open({
                templateUrl: '/staff_modal',
                controller: 'StaffModalController',
                controllerAs: 'vm',
                resolve: {
                    currentStaffAction: function () {
                        return vm.currentStaffAction;
                    },
                    staff: function () {
                        return vm.currentStaff;
                    },
                    currentOrganization: function () {
                        return vm.currentOrganization;
                    }
                },
                backdrop: 'static'
            });
            modalInstance.result.then(function (staff) {
                vm.currentStaffAction.action(staff);
            });
        }

        function addStaff(staffObj) {
            if (staffObj === null) {
                return;
            }
            staffObj.isAdmin = true;
            var staff = new StaffService(staffObj);
            staff.$save(function (res) {
                vm.refreshStaff();
            });
        }

        function updateStaff(staffObj) {
            if (staffObj === null) return;
            var updateInfo = {
                firstName: staffObj.firstName,
                lastName: staffObj.lastName,
                roles: staffObj.roles
            };
            StaffService.update({
                staffId: staffObj._id
            }, updateInfo, function (res) {
                vm.refreshStaff();
            });
        }

        function changeStatus(staff) {
            if (staff === null) return;
            var options = {};
            options.active = staff.status !== 1;
            StaffService.changeStatus({
                staffId: staff._id
            }, options).$promise.then(refreshStaff);
        }

        function deleteStaff(staff) {
            if (staff === null || staff.status === 1) return;
            Notification.confirm('202001', [staff.email], function () {
                staff = new StaffService(staff);
                staff.$remove(refreshStaff);
            });
        }

        function resetPassword(staff) {
            if (staff === null || staff.status === -1) return;
            StaffService.passwordReset({
                staffId: staff._id
            }).then(function () {
                vm.refreshStaff();
            });
        }

        function resetPage() {
            vm.pageOptions.page = 1;
        }
    }

    StaffModalController.$inject = ['$uibModalInstance', 'currentStaffAction', 'staff', 'currentOrganization'];

    function StaffModalController($modalInstance, currentStaffAction, staff, currentOrganization) {
        var vm = this;

        vm.staff = staff;
        vm.current = {};
        vm.currentStaffAction = currentStaffAction;
        vm.currentOrganization = currentOrganization;
        if (vm.staff.changeReason !== '') {
            vm.staff.changeReason = '';
        }

        vm.operateStaff = operateStaff;

        function operateStaff() {
            vm.current = {};
            vm.staff.roles = ['staff'];
            $modalInstance.close(vm.staff);
        }
    }
}());
