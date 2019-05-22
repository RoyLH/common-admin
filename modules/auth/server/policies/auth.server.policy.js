'use strict';

exports.invokeRolesPolicies = (acl) => {
  acl.allow([
    {
      roles: ['admin', 'superuser'],
      allows: [
        {
          resources: '/app/auth/password',
          permissions: ['put']
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/app/auth/signout',
          permissions: ['*']
        },
        {
          resources: '/app/auth/signin',
          permissions: ['*']
        }
      ]
    }
  ]);
};
