/**
 * Created by szhitenev on 09.03.2016.
 */
(function () {

    'use strict';

    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var minifyCSS = require('gulp-minify-css');
    var rename = require('gulp-rename');

    var appName = 'core';

    gulp.task(appName + '-copy-libs-js', function () {

        var pathToJS = [
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-messages/angular-messages.js',
            'node_modules/angular-touch/angular-touch.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/v-accordion/dist/v-accordion.js',
            'node_modules/angular-paging/dist/paging.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/angular-material-icons/angular-material-icons.js',

            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-ui-scroll/dist/ui-scroll.js',
            'node_modules/ui-select/dist/select.js',

            'node_modules/core-js/client/core.js',

            'node_modules/jquery/dist/jquery.js',

            'node_modules/whatwg-fetch/fetch.js',

            'node_modules/moment/moment.js',

            'node_modules/dragula/dist/dragula.js',
            'node_modules/angular-dragula/dist/angular-dragula.js',

            'node_modules/fancy-logger/dist/js/fancy-logger.js',
            'node_modules/jstree/dist/jstree.js',
            'node_modules/toastr/build/toastr.min.js',
            'node_modules/mdPickers/dist/mdPickers.js',
            'node_modules/d3/dist/d3.js',
            'src/core/datepicker/pickmeup.js'
        ];

        return gulp.src(pathToJS)
            .pipe(gulp.dest('libs/js'));


    });

    gulp.task(appName + '-copy-libs-css', function () {

        var pathToJS = [
            'node_modules/angular-material/angular-material.css',
            'node_modules/mdPickers/dist/mdPickers.css',
            'node_modules/ui-select/dist/select.css',
            'node_modules/v-accordion/dist/v-accordion.css',

            'node_modules/dragula/dist/dragula.css',

            'node_modules/jstree/dist/themes/default/style.css',
            'node_modules/toastr/build/toastr.css',
            'node_modules/pickmeup/css/pickmeup.css'
        ];

        return gulp.src(pathToJS)
            .pipe(gulp.dest('libs/css'));


    });

    gulp.task(appName + '-angular-js-min', function () {

        var pathToJS = [
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-messages/angular-messages.js',
            'node_modules/angular-touch/angular-touch.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/v-accordion/dist/v-accordion.js',
            'node_modules/angular-paging/dist/paging.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/mdPickers/dist/mdPickers.js',
            'node_modules/angular-material-icons/angular-material-icons.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('angular.js'))
            .pipe(uglify())
            .pipe(rename('angular.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));
    });

    gulp.task(appName + '-min-Angular-UI-JS', function () {

        var pathToJS = [
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-ui-scroll/dist/ui-scroll.js',
            'node_modules/ui-select/dist/select.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('angular-ui.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));
    });

    gulp.task(appName + '-angular-css-min', function () {

        var pathToCSS = [
            'node_modules/angular-material/angular-material.css',
            'node_modules/mdPickers/dist/mdPickers.css',
            'node_modules/ui-select/dist/select.css',
            'node_modules/v-accordion/dist/v-accordion.css',
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('angular.css'))
            .pipe(minifyCSS())
            .pipe(rename('angular.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css'));

    });

    gulp.task(appName + '-core-js-min', function () {

        var pathToJS = ['node_modules/core-js/client/core.js'];

        return gulp.src(pathToJS)
            .pipe(uglify())
            .pipe(rename('corejs.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-jquery-js-min', function () {

        var pathToJS = ['node_modules/jquery/dist/jquery.js'];

        return gulp.src(pathToJS)
            .pipe(concat('jquery.js'))
            .pipe(uglify())
            .pipe(rename('jquery.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-fetch-js-min', function () {

        var pathToJS = ['node_modules/whatwg-fetch/fetch.js'];

        return gulp.src(pathToJS)
            .pipe(concat('fetch.js'))
            .pipe(uglify())
            .pipe(rename('fetch.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-moment-js-min', function () {

        var pathToJS = ['node_modules/moment/moment.js'];

        return gulp.src(pathToJS)
            .pipe(concat('moment.js'))
            .pipe(uglify())
            .pipe(rename('moment.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-dragula-js-min', function () {

        var pathToJS = [
            'node_modules/dragula/dist/dragula.js',
            'node_modules/angular-dragula/dist/angular-dragula.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('dragula.js'))
            .pipe(uglify())
            .pipe(rename('dragula.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-dragula-css-min', function () {

        var pathToCSS = [
            'node_modules/dragula/dist/dragula.css'
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('dragula.css'))
            .pipe(minifyCSS())
            .pipe(rename('dragula.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css'));

    });

    gulp.task(appName + '-plugins-js-min', function () {

        var pathToJS = [
            'node_modules/fancy-logger/dist/js/fancy-logger.js',
            'node_modules/jstree/dist/jstree.js',
            'node_modules/toastr/build/toastr.min.js',
            'src/core/datepicker/pickmeup.js',
            'node_modules/d3/dist/d3.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('plugins.js'))
            .pipe(uglify())
            .pipe(rename('plugins.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-plugins-css-min', function () {

        var pathToCSS = [
            'node_modules/jstree/dist/themes/default/style.css',
            'node_modules/toastr/build/toastr.css',
            'node_modules/pickmeup/css/pickmeup.css'
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('plugins.css'))
            .pipe(minifyCSS())
            .pipe(rename('plugins.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css'));

    });


    gulp.task(appName + '-min-All', gulp.parallel(
        appName + '-angular-js-min',
        appName + '-angular-css-min',
        appName + '-core-js-min',
        appName + '-plugins-js-min',
        appName + '-min-Angular-UI-JS',
        appName + '-moment-js-min',
        appName + '-fetch-js-min',
        appName + '-jquery-js-min',
        appName + '-plugins-css-min',
        appName + '-dragula-js-min',
        appName + '-dragula-css-min'
    ))

}());