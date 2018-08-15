(function () {
    'use strict';

    angular.module('files')
        .controller('FilesInsertController', FilesInsertController)
        .factory('FilesInsertService', FilesInsertService);

    FilesInsertService.$inject = ['$uibModal', 'FilesService'];

    function FilesInsertService($modal, FilesService) {
        var FilesInsert = {};
        FilesInsert.insert = function (cb) {
            var modalInstance = $modal.open({
                templateUrl: '/modules/file/client/views/files-insert.client.view.html',
                controller: 'FilesInsertController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {}
            });
            modalInstance.result.then(function (data) {
                cb && cb(data);
            });
        };
        return FilesInsert;
    }

    FilesInsertController.$inject = ['FilesService'];

    function FilesInsertController(FilesService) {
        var vm = this;
        vm.imgReg = /\.(jpeg|png|jpg|gif)$/;
        vm.uploadedFiles = [];
        vm.selectedFiles = [];
        vm.flowOptions = {
            singleFile: false,
            target: '/app/files/local?folder=index'
        };
        vm.init = function () {
            FilesService.query({isDir: 0, type: 'img'}).$promise.then(function (files) {
                vm.files = files;
            });
        };
        vm.selectFiles = function () {
            vm.selectedFiles = [];
            vm.files.forEach(function (file) {
                file.checked && vm.selectedFiles.push(file);
            });
        };
        vm.getUploadFiles = function (file, message) {
            var uploaddedFile = JSON.parse(message).data;
            vm.uploadedFiles.push(uploaddedFile);
        };
    }
}());
