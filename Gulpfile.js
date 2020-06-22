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

    var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';

    gulp.task('default', gulp.parallel('core-min-All', 'portal-min-All'));

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

        return gulp.src(['dist/portal/scripts/main.min.js'])
            .pipe(replace(/__API_HOST__/g, API_HOST))
            .pipe(gulp.dest('dist/portal/scripts/'))

    });

}());
