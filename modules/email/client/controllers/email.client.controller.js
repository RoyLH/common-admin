(function () {
  'use strict';

  angular
        .module('email')
        .controller('EmailController', EmailController)
        .controller('emailJSONModalController', emailJSONModalController)
        .controller('EmailTemplateModalController', EmailTemplateModalController)
        .controller('SendTestEmailModalController', SendTestEmailModalController);

  EmailController.$inject = ['EmailService', '$uibModal', 'textAngularManager', 'Notification'];

  function EmailController(EmailService, $modal, textAngularManager, Notification) {
    var vm = this;

    vm.editable = false;
    vm.init = init;
    vm.resetEdit = resetEdit;
    vm.save = save;
    vm.remove = remove;
    vm.toggleEmail = toggleEmail;
    vm.showEditModal = showEditModal;
    vm.showSendTestEmailModal = showSendTestEmailModal;
    vm.showJSONModal = showJSONModal;

    function init() {
      vm.editable = false;
      EmailService.query().$promise.then(function (emails) {
        vm.emails = emails;
        vm.currentEmail = vm.currentEmail || angular.copy(emails[0]);
      });
    }

    function toggleEmail(email) {
      vm.currentEmail = angular.copy(email);
      vm.editable = false;
    }

    function resetEdit() {
      vm.editable = false;
      angular.forEach(vm.emails, function (email) {
        if (email._id === vm.currentEmail._id) {
          vm.currentEmail = angular.copy(email);
        }
      });
    }

    function save(email) {
      if (!email._id) {
        email = new EmailService(email);
        email.$save(init);
      } else {
        email.$update(init);
      }
    }

    function remove() {
      Notification.confirm('202001', [vm.currentEmail.title], function () {
        vm.currentEmail.$remove(init);
      });
    }

    function showEditModal() {
      var modalInstance = $modal.open({
        templateUrl: '/add_email_template_form',
        controller: EmailTemplateModalController,
        controllerAs: 'vm',
        backdrop: 'static'
      });
      modalInstance.result.then(save);
    }

    function showSendTestEmailModal() {
      var modalInstance = $modal.open({
        templateUrl: '/send_test_email_form',
        controller: 'SendTestEmailModalController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: {
          variables: function () {
            var uniqueAttrs = [];
            if (!vm.currentEmail.body) {
              return [];
            }
            var matchAttrs = vm.currentEmail.body.match(/\{\{\{([\w]+?)\}\}\}/g);
            matchAttrs && matchAttrs.forEach(function (attr) {
              if (!uniqueAttrs[attr]) {
                uniqueAttrs.push(attr.match(/\{\{\{([\w]+)}}}/)[1]);
                uniqueAttrs[attr] = true;
              }
            });
            return uniqueAttrs;
          }
        }
      });
      modalInstance.result.then(function (data) {
        EmailService.sendTestEmail({
          target: data.target,
          title: vm.currentEmail.title,
          info: data.info
        });
      });
    }

    function showJSONModal() {
      $modal.open({
        templateUrl: '/email_json_edit_modal_html',
        controller: 'emailJSONModalController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: {
          emails: function () {
            return vm.emails;
          }
        }
      });
    }
  }

  EmailTemplateModalController.$inject = [];

  function EmailTemplateModalController() {
    var vm = this;
    vm.email = {};
  }

  SendTestEmailModalController.$inject = ['variables'];

  function SendTestEmailModalController(variables) {
    var vm = this;
    vm.variables = variables;
    vm.sendInfo = {
      info: {}
    };
  }

  function emailJSONModalController(emails) {
    var vm = this;
    vm.emailsJSON = JSON.stringify(emails.map(function (email) {
      return {
        target: email.target,
        subject: email.subject,
        name: email.name,
        title: email.title,
        body: email.body
      };
    }));
  }
}());
