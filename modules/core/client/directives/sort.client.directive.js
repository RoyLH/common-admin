(function () {
  'use strict';

    // Focus the element on page load
    // Unless the user is on s small directive, because this could obscure the page with a keyboard

  angular.module('core')
        .directive('sort', Sort);

  function Sort() {
    return {
      restrict: 'A',
      transclude: true,
      template: '<span ng-click="onClick()" ng-class="{\'desc\':$root.selectItemGroup[target] === order&&$root.reverseGroup[target], \'asc\': $root.selectItemGroup[target] === order&&!$root.reverseGroup[target]}" class="sorting">' +
            '<ng-transclude></ng-transclude>' +
            '</span>',
      scope: {
        order: '=',
        target: '=',
        data: '='
      },
      link: function (scope, element, attrs) {
        var sortTable = function () {
          if (scope.order === scope.$root.selectItemGroup[scope.target]) {
            scope.$root.reverseGroup[scope.target] = !scope.$root.reverseGroup[scope.target];
          } else {
            scope.$root.selectItemGroup[scope.target] = scope.order;
            scope.$root.reverseGroup[scope.target] = false;
          }

          scope.$root.selectItem = scope.$root.selectItemGroup.default;
          scope.$root.reverse = scope.$root.reverseGroup.default;
        };

        scope.onClick = function () {
          if (!scope.target) scope.target = 'default';
          if (!scope.$root.selectItemGroup) scope.$root.selectItemGroup = {};
          if (!scope.$root.reverseGroup) scope.$root.reverseGroup = {};

          if (scope.data) {
            sortTable();
            scope.data(scope.order, scope.$root.reverseGroup[scope.target]);
          } else {
            sortTable();
          }
        };
      }
    };
  }
}());
