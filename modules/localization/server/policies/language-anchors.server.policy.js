'use strict';

exports.invokeRolesPolicies = function (acl) {
  acl.allow([
    {
      roles: ['admin', 'superuser'],
      allows: [
        {
          resources: '/app/language-anchors',
          permissions: '*'
        },
        {
          resources: '/app/language-anchors/:languageAnchorId',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/app/language-anchors',
          permissions: ['get']
        },
        {
          resources: '/app/language-anchors/:languageAnchorId',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['admin', 'superuser'],
      allows: [
        {
          resources: '/app/language-anchors/import',
          permissions: 'post'
        }
      ]
    }
  ]);
};
