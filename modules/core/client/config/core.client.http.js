(function () {
  'use strict';

  angular
        .module('core')
        .config(httpProvider);

  httpProvider.$inject = ['$httpProvider'];

    // no cache
  function httpProvider($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get.Pragma = 'no-cache';
  }
}());
