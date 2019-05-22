(function () {
  'use strict';

  angular
        .module('localization')
        .factory('LanguageAnchorsService', LanguageAnchorsService);

  LanguageAnchorsService.$inject = ['$resource'];

  function LanguageAnchorsService($resource) {
    var LanguageAnchors = $resource('app/language-anchors/:languageAnchorId', {
      languageAnchorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      import: {
        method: 'POST',
        url: 'app/language-anchors/import'
      }
    });

    angular.extend(LanguageAnchors, {
      importJSON: function (JSONdata) {
        return this.import(JSONdata).$promise;
      }
    });
    return LanguageAnchors;
  }
}());
