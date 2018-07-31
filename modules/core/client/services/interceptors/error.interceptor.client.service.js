(function () {
    'use strict';

    angular
        .module('core')
        .factory('errorHttpInterceptor', errorHttpInterceptor);

    errorHttpInterceptor.$inject = ['$q', '$rootScope', '$injector'];

    function errorHttpInterceptor($q, $rootScope, $injector) {
        $rootScope.mainLoading = false;
        $rootScope.http = null;
        function checkLoading() {
            $rootScope.http = $rootScope.http || $injector.get('$http');
            var needShowLoading = $rootScope.http.pendingRequests.some(function(request){
                if (!request.headers.background) {
                    return true;
                }
                return false;
            });

            if (!needShowLoading) {
                $rootScope.mainLoading = false;
            }
        }

        return {
            'request': function (config) {
                if ((!config.headers || !config.headers.background)) {
                    $rootScope.mainLoading = true;
                }
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                checkLoading();
                return $q.reject(rejection);
            },
            'response': function (response) {
                checkLoading();
                if (response.data.code) {
                    if (response.data.code !== '400000') {
                        var Notification = $injector.get('Notification');
                        Notification.show(response.data.code, response.data.messageInfo);
                    }
                    response.data = response.data.data;
                }

                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                checkLoading();

                var messageCode = (rejection.data && rejection.data.code) || rejection.status.toString();
                var messageInfo = (rejection.data && rejection.data.messageInfo);
                if (rejection.data && rejection.data.stack) {
                    console.error(rejection.data.stack);
                }
                var Notification = $injector.get('Notification');
                Notification.show(messageCode, messageInfo);
                return $q.reject(rejection);
            }
        };
    }
}());
