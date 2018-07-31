(function () {
    'use strict';
    
    angular
        .module('config')
        .factory('ConfigService', ConfigService);
    
    ConfigService.$inject = ['$resource'];
    
    function ConfigService($resource) {
        return $resource('app/config/:configId', {
            configId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());