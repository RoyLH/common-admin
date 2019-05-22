(function () {

  'use strict';

  angular.module('email')
    .factory('EmailService', EmailService);

  EmailService.$inject = ['$resource'];

  function EmailService($resource) {

    var Emails = $resource('app/emails/:emailId',
      {
        emailId: '@_id'
      },
      {
        update: {
          method: 'PUT'
        },
        sendTestEmail: {
          method: 'POST',
          url: '/app/emails/test/template'
        }
      }
        );

    return Emails;
  }

}());
