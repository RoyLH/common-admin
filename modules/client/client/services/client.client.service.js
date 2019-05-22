(function () {
  'use strict';

  angular
    .module('client')
    .factory('ClientService', ClientService);

  ClientService.$inject = ['$resource'];

  function ClientService($resource) {
    return $resource('/app/clients/:clientId', {
      clientId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
