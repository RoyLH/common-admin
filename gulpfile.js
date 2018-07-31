'use strict';

require('dotenv').load();

const _ = require('lodash'),
    fs = require('fs'),
    defaultAssets = require('./config/assets/default'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins();

// set environment variable (NODE_ENV)
gulp.task('env:test', () => {
    process.env.NODE_ENV = 'test';
});
gulp.task('env:dev', () => {
    process.env.NODE_ENV = 'development';
});
gulp.task('env:pro', () => {
    process.env.NODE_ENV = 'production';
});

// make sure upload directory exists
gulp.task('makeUploadAndLogDir', () => {
    fs.mkdir('upload', (err) => {
        if (err && err.code !== 'EXIST') {
            console.error(err);
        }
    });
    fs.mkdir('logs', (err) => {
        if (err && err.code !== 'EXIST') {
            console.error(err);
        }
    });
});

// lint
// sass to css
gulp.task('sass', () => {
    return gulp.src(defaultAssets.client.sass)
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest('modules'));
});

// plugins.csslint.addFormatter('csslint-stylish');
// csslint
gulp.task('csslint', () => {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.formatter());
});

// eslint
gulp.task('eslint', () => {
    let assets = _.union(
        defaultAssets.server.gulpConfig,
        defaultAssets.server.allJS,
        defaultAssets.client.js
    );
    return gulp.src(assets)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
});

// Lint CSS and JavaScript files.
gulp.task('lint', (done) => {
    runSequence('sass', ['csslint', 'eslint'], done);
});

// nodemon task
gulp.task('nodemon', () => {
    return plugins.nodemon({
        script: 'server.js',
        ext: 'js,html',
        verbose: true,
        tasks: ['eslint'],
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    })
        .on('config:update', () => {
            // Delay before server listens on port
            let config = require('./config/config');
            setTimeout(() => {
                require('open')('http://localhost:' + config.port);
            }, 3000);
        })
        .on('restart', () => {
            // Delay before server listens on port
            setTimeout(() => {
                require('fs').writeFileSync('.rebooted', 'rebooted');
            }, 2000);
        });
});

// watch task
gulp.task('watch', () => {
    // Start livereload
    plugins.refresh.listen();
// Add watch rules
    gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.server.allJS).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.js).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.css).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.sass, ['sass']);
    gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
});

// Run the project in development mode
gulp.task('default', (done) => {
    runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});