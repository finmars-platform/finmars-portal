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
    var del = require('del');
    var strip = require('gulp-strip-comments');

    var appName = 'core';

    /* gulp.task(appName + '-copy-libs-js', function () {

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

            'node_modules/qrious/dist/qrious.js',

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

    }); */

    /*gulp.task(appName + '-copy-libs-css', function () {

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


    });*/
    gulp.task(appName + '-copy-libs-css', function () {

        var pathToJS = [
            'src/core/content/css/*',
        ];

        return gulp.src(pathToJS)
            .pipe(concat('libs.css'))
            .pipe(minifyCSS())
            .pipe(rename('libs.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));
    });

    gulp.task(appName + '-copy-libs-fonts', function () {

        /*var pathToCSS = [
            'node_modules/material-design-icons/iconfont/!*.eot',
            'node_modules/material-design-icons/iconfont/!*.svg',
            'node_modules/material-design-icons/iconfont/!*.ttf',
            'node_modules/material-design-icons/iconfont/!*.woff',
            'node_modules/material-design-icons/iconfont/!*.woff2'
        ];*/
        var pathToCSS = [
            'src/core/content/fonts/**/*.eot',
            'src/core/content/fonts/**/*.svg',
            'src/core/content/fonts/**/*.ttf',
            'src/core/content/fonts/**/*.woff',
            'src/core/content/fonts/**/*.woff2'
        ];

        return gulp.src(pathToCSS)
            .pipe(gulp.dest('dist/' + appName + '/content/fonts/'));
    });

    gulp.task(appName + '-polyfills-js-min', function () { // core-polyfills-js-min

        var pathToJS = [
            'node_modules/@babel/polyfill/dist/polyfill.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('polyfills.js'))
            .pipe(uglify())
            .pipe(rename('polyfills.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));
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

    gulp.task(appName + '-angular-dev-js-min', function () {

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
            // .pipe(uglify())
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

    gulp.task(appName + '-min-dev-Angular-UI-JS', function () {

        var pathToJS = [
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-ui-scroll/dist/ui-scroll.js',
            'node_modules/ui-select/dist/select.js'
        ];

        return gulp.src(pathToJS)
            .pipe(concat('angular-ui.min.js'))
            // .pipe(uglify())
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

    gulp.task(appName + '-fullcalendar-js-min', function () {

        var pathToJS = [
            'node_modules/fullcalendar/main.js',
        ];

        return gulp.src(pathToJS)
            .pipe(concat('fullcalendar.js'))
            .pipe(uglify())
            .pipe(rename('fullcalendar.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-fullcalendar-css-min', function () {

        var pathToCSS = [
            'node_modules/fullcalendar/main.css'
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('fullcalendar.css'))
            .pipe(minifyCSS())
            .pipe(rename('fullcalendar.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css'));

    });


    /*gulp.task(appName + '-fontawesome-css-min', function () {

        var pathToCSS = [
            'node_modules/@fortawesome/fontawesome-free/css/all.css'
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('fontawesome.css'))
            .pipe(minifyCSS())
            .pipe(rename('fontawesome.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));

    });*/

    function fontawesomeCssMin() {
        var pathToCSS = [
            'node_modules/@fortawesome/fontawesome-free/css/all.css'
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('fontawesome.css'))
            .pipe(minifyCSS())
            .pipe(rename('fontawesome.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));
    }

    function fontawesomeFontsCopy() {
        var pathToCSS = ['node_modules/@fortawesome/fontawesome-free/webfonts/*'];

        return gulp.src(pathToCSS)
            .pipe(gulp.dest('dist/' + appName + '/content/webfonts/'));
    }

    gulp.task(appName + '-fontawesome-min', gulp.series(fontawesomeCssMin, fontawesomeFontsCopy));

    function deleteTempFolder() {
        return del(['src/temp']);
    }

    function minPluginsJs() {

        var pathToJS = [
            'node_modules/fancy-logger/dist/js/fancy-logger.js',
            'node_modules/jstree/dist/jstree.js',
            'node_modules/toastr/build/toastr.min.js',
            'node_modules/jsondiffpatch/dist/jsondiffpatch.umd.js',
            'src/core/datepicker/pickmeup.js',
            'src/core/keycloak/keycloak.js',
            'src/core/ace/ace.js',
            'src/core/ace/ext-language_tools.js',
            'src/core/ace/ext-searchbox.js',
            'src/core/ace/mode-json.js',
            'src/core/ace/mode-yaml.js',
            'src/core/ace/mode-python.js',
            'src/core/ace/mode-css.js',
            'src/core/ace/mode-html.js',
            'src/core/ace/mode-javascript.js',
            'src/core/ace/theme-monokai.js',

            'node_modules/d3/dist/d3.js',
            'node_modules/qrious/dist/qrious.js'
        ];

        /*return gulp.src(pathToJS)
            .pipe(concat('plugins.js'))
            .pipe(uglify())
            .pipe(rename('plugins.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));*/

        return gulp.src(pathToJS)
            .pipe(concat('plugins.js'))
            .pipe(uglify())
            .pipe(rename('plugins.min.js'))
            .pipe(gulp.dest('src/temp/' + appName + '/'));

    }

    function mergePluginsMinJs() {

        var pathToMinJs = [
            'src/temp/' + appName + '/plugins.min.js',
            'node_modules/@simonwep/pickr/dist/pickr.min.js'
        ];

        return gulp.src(pathToMinJs)
            .pipe(strip({trim: true}))
            .pipe(concat('plugins.min.js'))
            .pipe(gulp.dest('dist/' + appName + '/scripts/'));
    }

    gulp.task(appName + '-plugins-js-min', gulp.series(minPluginsJs, mergePluginsMinJs, deleteTempFolder));

    function minPluginsCss() {
        var pathToCSS = [
            'node_modules/jstree/dist/themes/default/style.css',
            'node_modules/toastr/build/toastr.css',
            'node_modules/pickmeup/css/pickmeup.css',
            'node_modules/jsondiffpatch/dist/formatters-styles/annotated.css',
            'node_modules/jsondiffpatch/dist/formatters-styles/html.css',
        ];

        return gulp.src(pathToCSS)
            .pipe(concat('plugins.css'))
            .pipe(minifyCSS())
            .pipe(rename('plugins.min.css'))
            .pipe(gulp.dest('src/temp/' + appName + '/'));
    }

    function mergePluginsMinCss() {
        var pathToMinCSS = [
            'src/temp/' + appName + '/plugins.min.css',
            'node_modules/@simonwep/pickr/dist/themes/classic.min.css'
        ];

        return gulp.src(pathToMinCSS)
            .pipe(concat('plugins.min.css'))
            .pipe(strip.text({trim: true, ignore: /url\([\w\s:\/=\-\+;,]*\)/g}))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));
    }

    gulp.task(appName + '-plugins-css-min', gulp.series(minPluginsCss, mergePluginsMinCss));

    gulp.task(appName + '-min-All',
        gulp.parallel(
            appName + '-polyfills-js-min',
            appName + '-angular-js-min',
            appName + '-angular-css-min',
            appName + '-core-js-min',
            appName + '-plugins-js-min',
            appName + '-min-Angular-UI-JS',
            appName + '-moment-js-min',
            appName + '-fetch-js-min',
            appName + '-jquery-js-min',
            appName + '-plugins-css-min',
            appName + '-copy-libs-css',
            appName + '-copy-libs-fonts',
            appName + '-fontawesome-min',
            appName + '-dragula-js-min',
            appName + '-dragula-css-min',
            appName + '-fullcalendar-js-min',
            appName + '-fullcalendar-css-min',
        )
    );

}());