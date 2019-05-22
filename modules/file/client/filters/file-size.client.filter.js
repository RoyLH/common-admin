(function () {
  'use strict';

  angular.module('files')
        .filter('fileSizeFilter', fileSizeFilter);

  function fileSizeFilter() {
    return function (bytes) {
      if (bytes === 0)
        return '0 B';
      var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };
  }
}());

