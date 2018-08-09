/**
 * Copyright 2017 Erealm Info & Tech.
 *
 * Created by ken at 28 September 2017.
 */

'use strict';

/**
 * Invoke Messages Permissions
 */
exports.invokeRolesPolicies = function (acl) {
    acl.allow([
        {
            roles: ['stuff', 'superuser'],
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
