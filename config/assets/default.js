'use strict';

module.exports = {
    client: {
        lib: {
            css:[
                'node_modules/bootstrap/dist/css/bootstrap.min.css',
                'node_modules/ng-sortable/dist/ng-sortable.min.css',
                'node_modules/textangular/dist/textAngular.css'
            ],
            js: [
                'node_modules/angular/angular.min.js',
                'node_modules/angular-resource/angular-resource.min.js',
                'node_modules/angular-animate/angular-animate.min.js',
                'node_modules/angular-messages/angular-messages.min.js',
                'node_modules/angular-ui-router/release/angular-ui-router.min.js',
                'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
                'node_modules/ng-sortable/dist/ng-sortable.min.js',
                'node_modules/textangular/dist/textAngular-rangy.min.js',
                'node_modules/textangular/dist/textAngular-sanitize.min.js',
                'node_modules/textangular/dist/textAngular.min.js',
                'node_modules/ng-flow/dist/ng-flow-standalone.min.js',
                'node_modules/angular-translate/dist/angular-translate.min.js',
                'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
            ]
        },
        css: [
            'modules/core/client/css/bootstrap-theme.css',
            'modules/core/client/css/main.css',
            'modules/*/client/{css,less,scss}/*.css'
        ],
        sass: [
            'modules/*/client/scss/*.scss'
        ],
        font: [
            'modules/*/client/fonts/*'
        ],
        js: [
            'modules/core/client/app/config.js',
            'modules/core/client/app/init.js',
            'modules/*/client/*.js',
            'modules/*/client/**/*.js'
        ],
        img: [
            'modules/**/*/img/**/*.jpg',
            'modules/**/*/img/**/*.png',
            'modules/**/*/img/**/*.gif',
            'modules/**/*/img/**/*.svg'
        ],
        views: ['modules/*/client/views/**/*.html'],
        templates: ['build/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js'],
        allJs: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: 'modules/*/server/models/**/*.js',
        routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
        APIRoutes: ['modules/core/server/apiRoutes/**/*.js', 'modules/!(core)/server/apiRoutes/**/*.js'],
        cronJobs: 'modules/*/server/cronJobs/**/*.j',
        sockets: 'modules/*/server/sockets/**/*.js',
        config: 'modules/*/server/config/*.js',
        policies: 'modules/*/server/policies/*.js',
        views: 'modules/*/server/views/*.html'
    }
};