(function () {
    'use strict';

    angular.module('files')
        .factory('FilesService', FilesService);

    FilesService.$inject = ['$resource', '$http'];

    function FilesService($resource, $http) {
        var FilesService = $resource('app/files/:fileId', {
            fileId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            removeFiles: {
                method: 'DELETE',
                url: 'app/files'
            },
            createFolder: {
                method: 'POST',
                url: 'app/files/folders'
            },
            paginate: {
                method: 'GET',
                url: 'app/files'
            }
        });

        return FilesService;
    }
}());
