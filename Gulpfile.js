/**
 * Created by szhitenev on 09.03.2016.
 */
(function () {

    'use strict';

    var gulp = require('gulp');
    var requireDir = require('require-dir');
    var dir = requireDir('./gulptasks/');

    var clean = require('gulp-clean');

    var jsdoc = require('gulp-jsdoc3');
    var replace = require('gulp-replace');

    var string_replace = require('gulp-string-replace');

    var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';
    var WS_HOST = process.env.WS_HOST || 'ws://0.0.0.0:6969';
    var HEALTHCHECK_HOST = process.env.HEALTHCHECK_HOST || '';
    var AUTHORIZER_URL = process.env.AUTHORIZER_URL || 'http://0.0.0.0:8083/authorizer';
    var KEYCLOAK_ACCOUNT_PAGE = process.env.KEYCLOAK_ACCOUNT_PAGE || 'https://dev-auth.finmars.com/realms/finmars/account/';

    // gulp.task('default', gulp.parallel('core-min-All', 'profile-HTML-to-JS', 'portal-min-All', 'shell-min-All'));
	gulp.task('default', gulp.parallel('core-min-All', 'profile-min-All', 'database-min-All', 'portal-min-All', 'shell-min-All'));
	gulp.task('modules-min-All', gulp.parallel('profile-min-All', 'database-min-All', 'portal-min-All', 'shell-min-All'));

    gulp.task('doc-clean', function () {
        return gulp.src(['./docs'], {read: false, allowEmpty: true })
            .pipe(clean());
    });

    gulp.task('doc', gulp.series('doc-clean', function (cb) {

        return gulp.src(['README.md', './src/**/*.js'], {read: false})
            .pipe(jsdoc(cb));

    }));

    gulp.task('after-build-env-set',  function () {

        console.log('API_HOST: ' + API_HOST);
        console.log('WS_HOST: ' + WS_HOST);
        console.log('AUTHORIZER_URL: ' + AUTHORIZER_URL);
        console.log('HEALTHCHECK_HOST: ' + HEALTHCHECK_HOST);

        if (API_HOST.indexOf('https://') === -1 && API_HOST.indexOf('http://') === -1) {

            API_HOST  = "https://" + API_HOST;

            console.log("UPDATED API_HOST ADD HTTPS: " + API_HOST)
        }

        return gulp.src(['dist/config.js'])
            // .pipe(replace(/__API_HOST__/g, API_HOST))
            // .pipe(replace(/__WS_HOST__/g, WS_HOST))
            // .pipe(replace(/__AUTHORIZER_URL__/g, AUTHORIZER_URL))
            // .pipe(replace(/__HEALTHCHECK_HOST__/g, HEALTHCHECK_HOST))
            .pipe(string_replace('__API_HOST__', API_HOST))
            .pipe(string_replace('__WS_HOST__', WS_HOST))
            .pipe(string_replace('__AUTHORIZER_URL__', AUTHORIZER_URL))
            .pipe(string_replace('__HEALTHCHECK_HOST__', HEALTHCHECK_HOST))
            .pipe(string_replace('__KEYCLOAK_ACCOUNT_PAGE__', KEYCLOAK_ACCOUNT_PAGE))
            .pipe(gulp.dest('dist/'))

    });

})();
