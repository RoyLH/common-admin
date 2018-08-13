'use strict';

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = (acl) => {
    acl.allow([
        {
            roles: ['admin', 'superuser'],
            allows: [
                {
                    resources: '/app/emails',
                    permissions: ['get', 'post']
                },
                {
                    resources: '/app/emails/:emailId',
                    permissions: '*'
                },
                {
                    resources: '/app/emails/test/template',
                    permissions: 'post'
                }
            ]
        },
        {
            roles: ['user'],
            allows: [
                {
                    resources: '/app/emails',
                    permissions: ['get']
                }, {
                    resources: '/app/emails/:emailId',
                    permissions: ['get']
                }
            ]
        }
    ]);
};
