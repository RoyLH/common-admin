(function () {
  'use strict';

  angular
        .module('cache')
        .factory('CachesService', CachesService);

  CachesService.$inject = ['$http'];

  function CachesService($http) {
    var Caches = {
      query: function () {
        return $http.get('/app/caches');
      },
      read: function (cache) {
        return $http.get('/app/caches/' + encodeURIComponent(cache.key));
      },
      remove: function (cache) {
        return $http.delete('/app/caches/' + encodeURIComponent(cache.key));
      }
    };

    return Caches;
  }
}());
