'use strict';

exports.invokeRolesPolicies = (acl) => {
  acl.allow([
    {
      roles: ['superuser', 'admin'],
      allows: [
        {
          resources: [
            '/app/staffs'
          ],
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['superuser'],
      allows: [
        {
          resources: [
            '/app/staffs',
            '/app/staffs/:staffId?',
            '/app/staffs/:staffId/password',
            '/app/staffs/:staffId/status'
          ],
          permissions: ['*']
        }
      ]
    }
  ]);
};
