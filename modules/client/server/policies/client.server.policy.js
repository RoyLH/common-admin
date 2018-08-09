'use strict';

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function (acl) {

  // internal API.
    acl.allow([{
        roles: ['superuser', 'staff'],
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
