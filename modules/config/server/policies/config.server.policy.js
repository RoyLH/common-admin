'use strict';

/**
 *  Invoke Messages Permissions
 **/
exports.invokeRolesPolicies = (acl) => {
    acl.allow([
        {
            roles: ['admin', 'superuser'],
            allows: [
                {
                    resources: '/app/config',
                    permissions: '*'
                },
                {
                    resources: '/app/config/:configId',
                    permissions: '*'
                }
            ]
        },
        {
            roles: ['guest'],
            allows: [
                {
                    resources: '/app/config',
                    permissions: ['get']
                },
                {
                    resources: '/app/config/:configId',
                    permissions: ['get']
                }
            ]
        }
    ]);
};
