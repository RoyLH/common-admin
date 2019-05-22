(function () {
  'use strict';

  angular
        .module('core')
        .config(translateProvider);

  translateProvider.$inject = ['$translateProvider'];
  function translateProvider($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/modules/core/client/json/language-',
      suffix: '.json'
    });
    var preferLanguage = 'cn';
        // if (navigator.language.indexOf('zh') >= 0) {
        //     preferLanguage = 'cn';
        // }
    $translateProvider.preferredLanguage(preferLanguage);
    $translateProvider.fallbackLanguage(['cn', 'en']);
    localStorage.setItem('language', preferLanguage);
  }
}());
