'use strict';

exports.invokeRolesPolicies = function (acl) {
    acl.allow([
        {
            roles: ['staff', 'superuser'],
            allows: [
                {
                    resources: '/app/feedbacks',
                    permissions: '*'
                },
                {
                    resources: '/app/feedbacks/:feedbackId',
                    permissions: '*'
                }
            ]
        },
        {
            roles: ['guest'],
            allows: [
                {
                    resources: '/app/feedbacks',
                    permissions: ['get', 'post']
                },
                {
                    resources: '/app/feedbacks/:feedbackId',
                    permissions: ['get']
                }
            ]
        }
    ]);
};
