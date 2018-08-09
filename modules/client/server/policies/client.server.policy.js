'use strict';

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function (acl) {

  // internal API.
    acl.allow([{
        roles: ['superuser', 'stuff'],
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
