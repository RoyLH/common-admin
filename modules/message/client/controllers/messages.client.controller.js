(function () {
  'use strict';

    // Messages controller
  angular
        .module('message')
        .controller('MessagesController', MessagesController)
        .controller('MessageEditModalController', MessageEditModalController)
        .controller('JSONEditModalController', JSONEditModalController);

  MessagesController.$inject = ['messageResolve', 'ConfigService', 'ClientService', 'MessagesService', '$uibModal', 'Notification', '$q'];

  function MessagesController(message, ConfigService, ClientService, MessagesService, $modal, Notification, $q) {
    var vm = this;
    vm.message = message;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.init = init;
    vm.showModal = showModal;
    vm.messages = [];
    vm.languages = undefined;
    vm.clients = undefined;
    vm.options = {
      limit: 20,
      page: 1
    };

    function init() {
      if (!vm.languages || !vm.clients) {
        $q.all([ConfigService.query({name: 'languages'}).$promise, ClientService.query().$promise]).then(function (result) {
          var configs = result[0];
          vm.languages = (configs.length > 0 && JSON.parse(configs[0].option)) || [{'name': 'English', 'code': 'en'}];
          vm.clients = result[1];
          vm.messages = MessagesService.query();
        });
      } else {
        vm.messages = MessagesService.query();
      }

    }

        // Remove existing Message
    function remove(message) {
      Notification.confirm('202001', [message.code], function () {
        message.$remove(successCallback);
      });

      function successCallback() {
        init();
        Notification.load();
      }
    }

        // Save Message
    function save(message) {
      if (message._id) {
        message.$update(successCallback);
      } else {
        new MessagesService(message).$save(successCallback);
      }

      function successCallback(res) {
        init();
        Notification.load();
      }
    }

    function generate(JSONString) {
      MessagesService.importJSON({
        list: JSONString
      }).then(successCallback);

      function successCallback(res) {
        init();
        Notification.load();
      }
    }

    var modalEditor = {
      CREATE: {
        templateUrl: '/message_edit_modal_html',
        controller: 'MessageEditModalController',
        backdrop: 'static',
        action: save
      },
      UPDATE: {
        templateUrl: '/message_edit_modal_html',
        controller: 'MessageEditModalController',
        backdrop: 'static',
        action: save
      },
      IMPORT: {
        templateUrl: '/json_edit_modal_html',
        controller: 'JSONEditModalController',
        backdrop: 'static',
        action: generate
      },
      EXPORT: {
        templateUrl: '/json_edit_modal_html',
        controller: 'JSONEditModalController',
        backdrop: 'static',
        action: generate
      }
    };

    function showModal(currentAction, data) {
      var modalInstance = $modal.open({
        templateUrl: modalEditor[currentAction].templateUrl,
        controller: modalEditor[currentAction].controller,
        controllerAs: 'vm',
        windowClass: 'modal-default',
        backdrop: modalEditor[currentAction].backdrop,
        resolve: {
          data: function () {
            return data;
          },
          currentAction: function () {
            return currentAction;
          },
          clients: function () {
            return angular.copy(vm.clients);
          },
          languages: function () {
            return angular.copy(vm.languages);
          }
        }
      });
      modalInstance.result.then(function (message) {
        modalEditor[currentAction].action(message);
      });
    }
  }

  MessageEditModalController.$inject = ['$uibModalInstance', 'data', 'currentAction', 'clients', 'languages'];

  function MessageEditModalController($modalInstance, data, currentAction, clients, languages) {
    var vm = this;
    vm.currentAction = currentAction;
    var messageTypes = [
            {value: 1, name: 'ERROR'},
            {value: 2, name: 'WARNING'},
            {value: 3, name: 'INFO'},
            {value: 4, name: 'SUCCESS'}
    ];
    vm.messageTypes = messageTypes;
    vm.submittedMessage = angular.copy(data) || {};
    vm.clients = clients;
    vm.languages = languages;
    vm.submit = submit;
    vm.init = init;

    function init() {
      if (!vm.submittedMessage.clients || vm.submittedMessage.clients.length === 0) {
        vm.clients.forEach(function (client) {
          client.isChecked = false;
        });
      } else {
        vm.clients.forEach(function (client) {
          client.isChecked = vm.submittedMessage.clients.some(function (clientsItem) {
            return clientsItem === client.clientID;
          });
        });
      }
    }

    function submit() {
      vm.submittedMessage.clients = [];
      vm.clients.forEach(function (client) {
        client.isChecked && vm.submittedMessage.clients.push(client.clientID);
      });
      $modalInstance.close(vm.submittedMessage);
    }
  }

  JSONEditModalController.$inject = ['$uibModalInstance', 'data', 'currentAction'];

  function JSONEditModalController($modalInstance, data, currentAction) {
    var vm = this;
    vm.currentAction = currentAction;
    vm.submit = submit;
    vm.JSONString = '';
    if (data) {
      vm.JSONString = generateJSON(data);
    }

    function generateJSON(messages) {
      return JSON.stringify(messages.map(function (message) {
        return {
          code: message.code,
          content: message.content,
          clients: message.clients,
          type: message.type
        };
      }));
    }

    function submit() {
      $modalInstance.close(vm.JSONString);
    }
  }
}());
