(function () {
  'use strict';

  angular
        .module('message')
        .factory('Notification', NotificationProvider);

  angular
        .module('core')
        .controller('NotificationConfirmController', NotificationConfirmController);

  NotificationProvider.$inject = ['$timeout', '$http', '$compile', '$templateCache', '$rootScope', '$injector', '$sce', '$q', '$window', '$uibModal'];

  function NotificationProvider($timeout, $http, $compile, $templateCache, $rootScope, $injector, $sce, $q, $window, $modal) {

    var defaultOptions = {
      startTop: 10,
      startRight: 10,
      verticalSpacing: 10,
      horizontalSpacing: 10,
      positionX: 'center',
      delay: 3000,
      positionY: 'top',
      templateUrl: '/modules/message/client/views/notification.client.view.html',
      onClose: undefined,
      closeOnClick: true,
      maxCount: 0 // 0 - Infinite
    };

        // format messageInfo to message
    var format = function (string, object) {
      if (typeof string !== 'string') return string;
      object = object || {};
      var matchIndex = 0;
      return string.replace(/{([^{}]*)}/g,
                function (match, group_match) {
                  var data = object[group_match] || object[matchIndex] || group_match;
                  matchIndex++;
                  return typeof data === 'string' ? data : '';
                }
            );
    };

    var getMessageByCode = function (code, messageInfo) {
      var result = {content: 'An unknown error occurred. Please resubmit the request.', type: 'error'};
      defaultOptions.messages.some(function (message) {
        if (message.code === code.toString()) {
          result = {
            content: format(message.content, messageInfo),
            type: ['', 'error', 'warning', 'info', 'success'][message.type]
          };
          return true;
        }

        return false;
      });
      return result;
    };

    var messageElements = [];
    var isResizeBound = false;

    var showMessage = function (code, messageInfo, customOptions) {
      var startTop = defaultOptions.startTop;
      var startRight = defaultOptions.startRight;
      var verticalSpacing = defaultOptions.verticalSpacing;
      var horizontalSpacing = defaultOptions.horizontalSpacing;

      var deferred = $q.defer();
      var message = getMessageByCode(code, messageInfo);
      var options = angular.merge(defaultOptions, customOptions);
      options.scope = $rootScope;

            // get template
      $http.get(options.templateUrl, {cache: $templateCache}).success(function (template) {

        var scope = defaultOptions.scope.$new();
        scope.message = $sce.trustAsHtml(message.content);
        scope.title = $sce.trustAsHtml(message.title);
        scope.delay = options.delay;
        scope.onClose = options.onClose;

        var reposite = function () {
          var j = 0;
          var k = 0;
          var lastTop = startTop;
          var lastRight = startRight;
          var lastPosition = [];
          for (var i = messageElements.length - 1; i >= 0; i--) {
            var element = messageElements[i];
            var elHeight = parseInt(element[0].offsetHeight, 10);
            var elWidth = parseInt(element[0].offsetWidth, 10);
            var position = lastPosition[element._positionY + element._positionX];

            var top;
            if (position) {
              top = j === 0 ? position : position + verticalSpacing;
            } else {
              top = startTop;
            }
            if ((top + elHeight) > window.innerHeight) {
              position = startTop;
              k++;
              j = 0;
            }
            var right = lastRight + (k * (horizontalSpacing + elWidth));

            element.css(element._positionY, top + 'px');
            if (element._positionX === 'center') {
              element.css('left', parseInt(window.innerWidth / 2 - elWidth / 2, 10) + 'px');
            } else {
              element.css(element._positionX, right + 'px');
            }

            lastPosition[element._positionY + element._positionX] = top + elHeight;

            if (options.maxCount > 0 && messageElements.length > options.maxCount && i === 0) {
              element.scope().kill(true);
            }

            j++;
          }
        };

        var templateElement = $compile(template)(scope);
        templateElement._positionY = options.positionY;
        templateElement._positionX = options.positionX;
        templateElement.addClass(message.type);

        var closeEvent = function (e) {
          e = e.originalEvent || e;
          if (e.type === 'click' || (e.propertyName === 'opacity' && e.elapsedTime >= 1)) {
            if (scope.onClose) {
              scope.$apply(scope.onClose(templateElement));
            }

            templateElement.remove();
            messageElements.splice(messageElements.indexOf(templateElement), 1);
            scope.$destroy();
            reposite();
          }
        };

        if (options.closeOnClick) {
          templateElement.addClass('clickable');
          templateElement.bind('click', closeEvent);
        }

        templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', closeEvent);

        if (angular.isNumber(options.delay)) {
          $timeout(function () {
            templateElement.addClass('killed');
          }, options.delay);
        }

        setCssTransitions('none');

        angular.element(document.getElementsByTagName('body')).append(templateElement);
        var offset = -(parseInt(templateElement[0].offsetHeight, 10) + 50);
        templateElement.css(templateElement._positionY, offset + 'px');
        messageElements.push(templateElement);

        if (options.positionX === 'center') {
          var elWidth = parseInt(templateElement[0].offsetWidth, 10);
          templateElement.css('left', parseInt(window.innerWidth / 2 - elWidth / 2, 10) + 'px');
        }

        $timeout(function () {
          setCssTransitions('');
        });

        function setCssTransitions(value) {
          ['-webkit-transition', '-o-transition', 'transition'].forEach(function (prefix) {
            templateElement.css(prefix, value);
          });
        }

        scope._templateElement = templateElement;

        scope.kill = function (isHard) {
          if (isHard) {
            if (scope.onClose) {
              scope.$apply(scope.onClose(scope._templateElement));
            }

            messageElements.splice(messageElements.indexOf(scope._templateElement), 1);
            scope._templateElement.remove();
            scope.$destroy();
            $timeout(reposite);
          } else {
            scope._templateElement.addClass('killed');
          }
        };

        $timeout(reposite);

        if (!isResizeBound) {
          angular.element($window).bind('resize', function (e) {
            $timeout(reposite);
          });
          isResizeBound = true;
        }

        deferred.resolve(scope);

      }).error(function (data) {
        throw new Error('Template (' + options.template + ') could not be loaded. ' + data);
      });

      return deferred.promise;
    };

    var showConfirmMessage = function (code, messageInfo, callback) {
      var message = getMessageByCode(code, messageInfo);
      var modalInstance = $modal.open({
        templateUrl: '/modules/message/client/views/confirm.client.view.html',
        controller: 'NotificationConfirmController',
        controllerAs: 'vm',
        windowClass: 'modal-message',
        backdrop: 'static',
        resolve: {
          message: function () {
            return message.content;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (callback && result === 'yes') callback();
      });
    };

    return {
      language: localStorage.getItem('language') || 'en',
      show: function (code, messageInfo, options) {
        if (defaultOptions.messages) {
          return showMessage(code, messageInfo, options);
        } else {
          $http.get('/app/messages', {params: {language: this.language}}).success(function (messages) {
            defaultOptions.messages = messages;
            return showMessage(code, messageInfo, options);
          });
        }
      },

      load: function (callback) {
        return $http.get('/app/messages', {params: {language: this.language}}).success(function (messages) {
          defaultOptions.messages = messages;
          callback && callback();
        });
      },

      confirm: function (code, messageInfo, callback) {
        if (defaultOptions.messages) {
          return showConfirmMessage(code, messageInfo, callback);
        } else {
          $http.get('/app/messages', {params: {language: this.language}}).success(function (messages) {
            defaultOptions.messages = messages;
            return showConfirmMessage(code, messageInfo, callback);
          });
        }
      },

      clearAll: function () {
        angular.forEach(messageElements, function (element) {
          element.addClass('killed');
        });
      }
    };
  }


  NotificationConfirmController.$inject = ['message'];

  function NotificationConfirmController(message) {
    var vm = this;
    vm.message = message;
  }
}());
