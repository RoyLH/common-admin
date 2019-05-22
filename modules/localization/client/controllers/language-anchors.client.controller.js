(function () {
  'use strict';

  angular
        .module('localization')
        .controller('LanguageAnchorsController', LanguageAnchorsController)
        .controller('LanguageAnchorEditModalController', LanguageAnchorEditModalController)
        .controller('DataTransformEditModalController', DataTransformEditModalController)
        .controller('LanguageEditModalController', LanguageEditModalController);

  LanguageAnchorsController.$inject = ['$uibModal', 'LanguageAnchorsService', 'ConfigService', 'Notification', '$q', 'ClientService'];

  function LanguageAnchorsController($modal, LanguageAnchorsService, ConfigService, Notification, $q, ClientService) {
    var vm = this;
    vm.init = init;
    vm.remove = remove;
    vm.showEditModal = showEditModal;
    vm.removeLanguage = removeLanguage;
    vm.options = {
      limit: 20,
      page: 1
    };

    var initLanguageConfig = {
      name: 'languages',
      option: JSON.stringify([
                {name: 'English', code: 'en'},
                {name: 'Chinese', code: 'cn'}
      ])
    };

    function init() {
      $q.all([ConfigService.query({name: 'languages'}).$promise, ClientService.query().$promise, LanguageAnchorsService.query().$promise]).then(function (result) {
        vm.languageConfig = result[0][0];
        if (!vm.languageConfig) {
          vm.languageConfig = initLanguageConfig;
          new ConfigService(initLanguageConfig).$save();
        }
        vm.languages = JSON.parse(vm.languageConfig.option);
        vm.clients = result[1];
        var languageAnchorsList = result[2];
        languageAnchorsList.forEach(function (languageAnchor) {
          vm.languages.forEach(function (language) {
            if (languageAnchor.languageData) {
              languageAnchor[language.code] = languageAnchor.languageData[language.code] || '';
            } else {
              languageAnchor[language.code] = '';
            }
          });
        });
        vm.languageAnchorsList = languageAnchorsList;
        vm.currentLanguageAnchor = vm.languageAnchorsList[0];
      });
    }

    function remove(languageAnchor) {
      Notification.confirm('202001', [languageAnchor.key], function () {
        languageAnchor.$remove(init);
      });
    }

    function save(languageAnchor) {
      languageAnchor.clients = [];

            // change to array
      for (var clientID in languageAnchor.clientIsAbled) {
        if (languageAnchor.clientIsAbled[clientID]) {
          languageAnchor.clients.push(clientID);
        }
      }

      languageAnchor.languageData = {};
      vm.languages.forEach(function (language) {
        languageAnchor.languageData[language.code] = languageAnchor[language.code];
      });

      if (languageAnchor._id) {
        languageAnchor.$update(init);
      } else {
        new LanguageAnchorsService(languageAnchor).$save(init);
      }
    }

    function addLanguage(language) {
      var languages = angular.copy(vm.languages);
      languages.unshift(language);
      vm.languageConfig.option = JSON.stringify(languages);
      ConfigService.update(vm.languageConfig, init);
    }

    function removeLanguage(currentLanguage) {
      Notification.confirm('202001', [currentLanguage.name], function () {
        var languages = angular.copy(vm.languages);
        var newLanguages = languages.filter(function (language) {
          return language.code !== currentLanguage.code;
        });
        vm.languageConfig.option = JSON.stringify(newLanguages);
        ConfigService.update(vm.languageConfig, init);
      });
    }

    function importJSON(JSONData) {
      LanguageAnchorsService.importJSON(JSONData).then(init);
    }

    var modalConfig = {
      save: {
        templateUrl: '/language_anchor_edit_modal_html',
        controller: 'LanguageAnchorEditModalController',
        action: save
      },
      addLanguage: {
        templateUrl: '/language_edit_modal_html',
        controller: 'LanguageEditModalController',
        action: addLanguage
      },
      import: {
        templateUrl: '/data_transform_edit_modal_html',
        controller: 'DataTransformEditModalController',
        action: importJSON
      }
    };

    function showEditModal(currentAction, data) {
      var modalInstance = $modal.open({
        templateUrl: modalConfig[currentAction].templateUrl,
        controller: modalConfig[currentAction].controller,
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: {
          data: function () {
            return angular.copy(data) || {};
          },
          languages: function () {
            return vm.languages;
          },
          currentAction: function () {
            return currentAction;
          },
          clients: function () {
            return vm.clients;
          }
        }
      });
      modalInstance.result.then(function (data) {
        modalConfig[currentAction].action(data);
      });
    }
  }

  LanguageAnchorEditModalController.$inject = ['data', 'languages', 'clients'];

  function LanguageAnchorEditModalController(data, languages, clients) {
    var vm = this;
    vm.languages = languages;
    vm.clients = clients;
    vm.currentLanguageAnchor = data;
    vm.currentLanguageAnchor.clientIsAbled = {};

        // parse to object
    if (vm.currentLanguageAnchor.clients) {
      vm.currentLanguageAnchor.clients.forEach(function (clientID) {
        vm.currentLanguageAnchor.clientIsAbled[clientID] = true;
      });
    }
  }

  LanguageEditModalController.$inject = ['data'];

  function LanguageEditModalController(data) {
    var vm = this;
    vm.currentLanguage = data;
  }

  DataTransformEditModalController.$inject = ['data', 'currentAction'];

  function DataTransformEditModalController(LanguageAnchorsData, currentAction) {
    var vm = this;
    vm.currentAction = currentAction;
    if (LanguageAnchorsData && LanguageAnchorsData instanceof Array) {
      LanguageAnchorsData = LanguageAnchorsData.map(function (LanguageAnchor) {
        return {
          key: LanguageAnchor.key,
          languageData: LanguageAnchor.languageData,
          clients: LanguageAnchor.clients
        };
      });
    }
    vm.JSONdata = JSON.stringify(LanguageAnchorsData);
  }
}());

