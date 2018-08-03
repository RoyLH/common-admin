'use strict';

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function (acl) {

  // internal API.
    acl.allow([{
        roles: ['superuser', 'admin'],
        allows: [{
            resources: [
                '/app/clients',
                '/app/clients/:clientID'
            ],
            permissions: ['*']
        }]
    }]);

  // public API.
};
