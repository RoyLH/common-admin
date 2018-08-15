(function () {
    'use strict';
    angular.module('files')
        .controller('FilesController', FilesController)
        .controller('UploadFilesController', UploadFilesController)
        .controller('CreateFolderController', CreateFolderController);

    FilesController.$inject = ['FilesService', '$uibModal', 'Notification', 'FilesInsertService'];

    function FilesController(FilesService, $modal, Notification, FilesInsertService) {
        var vm = this;
        vm.types = [
            {value: 'doc', name: 'doc'},
            {value: 'img', name: 'img'},
            {value: 'mp3', name: 'mp3'}
        ];
        vm.imgReg = /\.(jpeg|png|jpg|gif)$/;
        vm.init = init;
        vm.initHistory = initHistory;
        vm.update = update;
        vm.remove = remove;
        vm.showEditModal = showEditModal;
        vm.removeFiles = removeFiles;
        vm.download = download;
        vm.downloadFiles = downloadFiles;
        vm.currentFolder = 'index';
        vm.historyRecord = ['index'];
        vm.folderIndex = 0;
        vm.enterFolder = enterFolder;
        vm.toPreFolder = toPreFolder;
        vm.toNextFolder = toNextFolder;
        vm.insertFiles = insertFiles;

        function insertFiles() {
            FilesInsertService.insert();
        }

        function init() {
            vm.currentFolder = vm.currentFolder || 'index';
            FilesService.query({
                folder: vm.currentFolder
            }).$promise.then(function (files) {
                vm.files = files;
            });
        }

        function initHistory() {
            vm.currentFolder = 'index';
            vm.historyRecord = ['index'];
            vm.folderIndex = 0;
        }

        function remove(file) {
            Notification.confirm('202001', [file.fileName], function () {
                file.$delete(init);
            });
        }

        function update(file) {
            file.$update().then(function () {
                file.editable = !file.editable;
            });
        }

        function removeFiles() {
            var checkFileIds = [];
            vm.files.forEach(function (file) {
                file.checked && checkFileIds.push(file._id);
            });
            if (checkFileIds.length === 0) {
                return Notification.show('202002');
            }
            Notification.confirm('202001', ['this files'], function () {
                FilesService.removeFiles({fileIds: checkFileIds}, init);
            });
        }

        function download(file) {
            var link = document.createElement('a');
            link.href = file.link;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function downloadFiles() {
            var checkFiles = [];
            vm.files.forEach(function (file) {
                file.checked && checkFiles.push(file);
            });
            if (checkFiles.length === 0) {
                return Notification.show('202002');
            }
            checkFiles.forEach(function (file) {
                download(file);
            });
        }

        function createFolder(folderName) {
            FilesService.createFolder({
                name: folderName,
                folder: vm.currentFolder
            }, init);
        }

        function enterFolder(folder) {
            vm.historyRecord = vm.historyRecord.slice(0, vm.folderIndex + 1);
            vm.historyRecord.push(folder.customName);
            vm.folderIndex++;
            vm.currentFolder = vm.historyRecord[vm.folderIndex];
            vm.dirs = folder.customName.split('\\');
            init();
        }

        function toPreFolder() {
            if (vm.folderIndex === 0) return false;
            vm.folderIndex--;
            vm.currentFolder = vm.historyRecord[vm.folderIndex];
            init();
        }

        function toNextFolder() {
            if (vm.folderIndex >= vm.historyRecord.length) return false;
            vm.folderIndex++;
            vm.currentFolder = vm.historyRecord[vm.folderIndex];
            init();
        }

        var modalConfig = {
            upload: {
                templateUrl: '/upload_files_modal_html',
                controller: 'UploadFilesController',
                action: init
            },
            createFolder: {
                templateUrl: '/create_folder_modal_html',
                controller: 'CreateFolderController',
                action: createFolder
            }
        };

        function showEditModal(currentAction, data) {
            var modalInstance = $modal.open({
                templateUrl: modalConfig[currentAction].templateUrl,
                controller: modalConfig[currentAction].controller,
                controllerAs: 'vm',
                backdrop: 'static',
                class: 'modal-common',
                resolve: {
                    currentAction: function () {
                        return currentAction;
                    },
                    currentFolder: function () {
                        return vm.currentFolder;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                modalConfig[currentAction].action(data);
            });
        }
    }

    UploadFilesController.$inject = ['currentFolder'];

    function UploadFilesController(currentFolder) {
        var vm = this;
        vm.imgReg = /\.(jpeg|png|jpg|gif)$/;
        vm.flowOptions = {
            singleFile: false,
            target: '/app/files/upload?folder=' + currentFolder
        };
    }

    CreateFolderController.$inject = [];

    function CreateFolderController() {}
}());
