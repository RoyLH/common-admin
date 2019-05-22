(function () {
  'use strict';

  angular
        .module('client')
        .controller('ClientController', ClientController)
        .controller('clientModalController', clientModalController);

  ClientController.$inject = ['$scope', '$uibModal', 'ClientService', 'Notification'];

  function ClientController($scope, $modal, ClientService, Notification) {

    var refresh = function () {
      ClientService.query(function (data) {
        $scope.clients = data;
      });
    };

    $scope.refresh = refresh;

    $scope.deleteClient = function (clientObj) {
      Notification.confirm('202001', [clientObj.clientID], function () {
        var client = new ClientService(clientObj);
        client.$remove(function (res) {
          refresh();
        });
      });
    };

    $scope.addClient = function () {
      var modalInstance = $modal.open({
        templateUrl: '/client_modal_form',
        controller: 'clientModalController',
        resolve: {
          currentClient: function () {
            return '';
          }
        },
        backdrop: 'static'
      });
      modalInstance.result.then(function (client) {
        new ClientService(client).$save(function (res) {
          refresh();
        });
      });
    };

    $scope.handleClient = function (clientObj, action) {
      if (action === 'refresh') {
        $scope.showConfirmMessage('202001', ['client', clientObj.clientID], function () {
          ClientService.update({action: action}, clientObj, function (res) {
            refresh();
          });
        });
      } else if (action === 'edit') {
        var modalInstance = $modal.open({
          templateUrl: '/client_modal_form',
          controller: 'clientModalController',
          resolve: {
            currentClient: function () {
              return clientObj;
            }
          },
          backdrop: 'static'
        });
        modalInstance.result.then(function (client) {
          ClientService.update({action: action}, clientObj, function (res) {
            refresh();
          });
        });
      } else {
        if (action === 'deactivate') {
          if (clientObj.status !== 1) {
            return;
          } else {
            clientObj.status = -1;
          }
        } else if (action === 'reactivate') {
          if (clientObj.status !== -1) {
            return;
          } else {
            clientObj.status = 1;
          }
        }
        ClientService.update({action: action}, clientObj, function () {
          refresh();
        });
      }
    };

  }

  clientModalController.$inject = ['$scope', '$uibModalInstance', 'currentClient'];

  function clientModalController($scope, $modalInstance, currentClient) {
    if (currentClient) {
      $scope.task = 'edit';
      $scope.client = currentClient;
    } else {
      $scope.task = 'add';
      $scope.client = {};
    }
    $scope.create = function () {
      $modalInstance.close($scope.client);
    };
  }

}());
