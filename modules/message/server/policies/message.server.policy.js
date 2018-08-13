'use strict';

exports.invokeRolesPolicies = (acl) => {
    acl.allow([
        {
            roles: ['admin', 'superuser'],
            allows: [
                {
                    resources: '/app/messages',
                    permissions: '*'
                },
                {
                    resources: '/app/messages/import',
                    permissions: ['post']
                },
                {
                    resources: '/app/messages/:messageId',
                    permissions: '*'
                }
            ]
        },
        {
            roles: ['guest'],
            allows: [
                {
                    resources: '/app/messages',
                    permissions: ['get']
                },
                {
                    resources: '/app/messages/:messageId',
                    permissions: ['get']
                }]
        }
    ]);
};
