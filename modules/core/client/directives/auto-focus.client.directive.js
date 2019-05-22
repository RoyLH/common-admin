(function () {
  'use strict';

    // Focus the element on page load
    // Unless the user is on s small directive, because this could obscure the page with a keyboard

  angular.module('core')
        .directive('autofocus', autofocus);

  autofocus.$inject = ['$timeout', '$window'];

  function autofocus($timeout, $window) {
    var directive = {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      if ($window.innerWidth >= 800) {
        $timeout(function () {
          var el = element[0];
          el.focus();
          el.selectionStart = el.selectionEnd = el.value.length;
        }, 100);
      }
    }

    return directive;
  }
}());
