'use strict';

exports.invokeRolesPolicies = (acl) => {
  acl.allow([
    {
      roles: ['admin', 'superuser'],
      allows: [
        {
          resources: '/app/caches',
          permissions: '*'
        }, {
          resources: '/app/caches/:key',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/app/caches',
          permissions: ['get']
        }, {
          resources: '/app/caches/:cacheId',
          permissions: ['get']
        }
      ]
    }
  ]);
};
