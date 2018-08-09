(function () {
    'use strict';

    angular
        .module('core')
        .run(routeFilter);

    routeFilter.$inject = ['$rootScope', '$state', 'Authentication', 'Notification'];

    function routeFilter($rootScope, $state, Authentication, Notification) {
        $rootScope.$on('$stateChangeStart', stateChangeStart);

        function stateChangeStart(event, toState, toParams, fromState, fromParams) {
            // Check authentication before changing state
            if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
                var allowed = false;
                for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
                    if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
                        allowed = true;
                        break;
                    }
                }

                if (!allowed) {
                    event.preventDefault();
                    if (Authentication.user !== null && typeof Authentication.user === 'object') {
                        Notification.show('403');
                    } else {
                        $state.go('authentication.signin').then(function () {
                            // Record previous state
                            storePreviousState(toState, toParams);
                        });
                    }
                }
            }
        }

        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            // Record previous state
            storePreviousState(fromState, fromParams);
            if (!toState.data) return;
            $rootScope.currentTitle = '- ' + toState.data.pageTitle + ' -';
        }

        // Store previous state
        function storePreviousState(state, params) {
            // only store this state if it shouldn't be ignored
            if (!state.data || !state.data.ignoreState) {
                $state.previous = {
                    state: state,
                    params: params,
                    href: $state.href(state, params)
                };
            }
        }
    }
}());
