'use strict';

exports.invokeRolesPolicies = (acl) => {
    // internal
  acl.allow([{
    roles: ['superuser', 'staff'],
    allows: [{
      resources: [
        '/app/users',
        '/app/users/:userId/password',
        '/app/users/:userId',
        '/app/users/:userId/status'
      ],
      permissions: ['*']
    }]
  }]);

    // public API.
  acl.allow([{
    roles: ['user', 'staff', 'superuser'],
    allows: [{
      resources: [
        '/users/:userId',
        '/users/:userId/password',
        '/users/:userId/waitForConfirmEmail',
        '/users/:userId/profileImage',
        '/users/email',
        '/users/:userId/username'
      ],
      permissions: ['*']
    }]
  }]);
};
