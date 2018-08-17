(function () {
    'use strict';
    angular
        .module('cache')
        .controller('CachesController', CachesController)
        .controller('RedisEditModalController', RedisEditModalController);

    CachesController.$inject = ['$uibModal', 'CachesService', 'Notification'];

    function CachesController($modal, CachesService, Notification) {
        var vm = this;
        vm.init = init;
        vm.remove = remove;
        vm.showEditModal = showEditModal;

        function init() {
            CachesService.query().then(function (cachesList) {
                vm.cachesList = cachesList.data;
            });
        }

        function remove(cache) {
            Notification.confirm('202001', [cache.key], function () {
                CachesService.remove(cache).then(init);
            });
        }

        var modalConfig = {
            read: {
                templateUrl: '/cache_edit_modal_html',
                controller: 'RedisEditModalController'
            }
        };

        function showEditModal(currentAction, data) {
            var modalInstance = $modal.open({
                templateUrl: modalConfig[currentAction].templateUrl,
                controller: modalConfig[currentAction].controller,
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    data: function () {
                        return angular.copy(data) || {};
                    }
                }
            });
        }
    }

    RedisEditModalController.$inject = ['data', 'CachesService'];

    function RedisEditModalController(data, CachesService) {
        var vm = this;
        CachesService.read(data).then(function (reply) {
            vm.currentRedis = reply.data;
        });
    }
}());

