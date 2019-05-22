(function () {
  'use strict';

  angular
        .module('staff')
        .factory('StaffService', StaffService);

  StaffService.$inject = ['$resource'];

  function StaffService($resource) {
    var Staffs = $resource('/app/staffs/:staffId/:action/', {
      staffId: '@_id',
      action: '@action'
    }, {
      paginate: {
        method: 'GET',
        url: '/app/staffs'
      },
      update: {
        method: 'PUT'
      },
      changeStatus: {
        method: 'PATCH',
        url: '/app/staffs/:staffId/status'
      },
      resetPassword: {
        method: 'PATCH',
        url: '/app/staffs/:staffId/password'
      }
    });

    angular.extend(Staffs, {
      passwordReset: function (staffId) {
        return this.resetPassword(staffId, {}).$promise;
      }
    });

    return Staffs;
  }
}());
