/**
 * Created by szhitenev on 09.03.2016.
 */
(function () {

    'use strict';

    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    // var stripDebug = require('gulp-strip-debug');
    var concat = require('gulp-concat');
	/* var minifyCSS = require('gulp-minify-css');
	var minifyHTML = require('gulp-minify-html');
	var less = require('gulp-less');
	var postcss = require('gulp-postcss');
	var autoprefixer = require('autoprefixer');
	var rename = require('gulp-rename'); */
    var livereload = require('gulp-livereload');
    var htmlmin = require('gulp-htmlmin');
    var ngHtml2Js = require('gulp-ng-html2js');
    /* var gulpif = require('gulp-if');
    var minimist = require('minimist'); */
	var replace = require('gulp-replace');

    //js
    /* var plumber = require('gulp-plumber');
    var preprocess = require('gulp-preprocess');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify'); */

    var commonTasks = require('./common.js');
    // var forumTasks = require('./forum');
    // var profileTasks = require('./profile.js');

    /* var PROJECT_ENV = process.env.PROJECT_ENV || 'local';
    var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';
    var AUTHORIZER_URL = process.env.AUTHORIZER_URL || 'http://0.0.0.0:8083/authorizer';
    var WS_HOST = process.env.WS_HOST || 'ws://0.0.0.0:6969';
    var HEALTHCHECK_HOST = process.env.HEALTHCHECK_HOST || ''; */

    var appName = 'portal'; // in case of change, also change 'portal-less-to-css-min' inside of others gulptasks (shell.js, profile.js)

    gulp.task(appName + '-less-to-css-min', function () {
		var pathToLess = ['src/' + appName + '/content/less/imports.less'];
		return commonTasks.lessToCssMin(pathToLess, appName);
    });

    /* gulp.task(appName + '-html-min', function () {

        var pathToHTML = ['src/!*.html'];

        return gulp.src(pathToHTML)
            .pipe(replace(/{hash}/g, new Date().getTime()))
            .pipe(minifyHTML())
            .pipe(gulp.dest('dist/'));

    }); */
	gulp.task('main-html-min', function () {
		return commonTasks.mainHtmlMin();
	});

    gulp.task(appName + '-json-min', function () {

        var pathToJSON = ['src/' + appName + '/content/json/**/*.json'];

        return gulp.src(pathToJSON)
            .pipe(gulp.dest('dist/' + appName + '/content/json/'));

    });

	function left_pad(num) {

		if (parseInt(num, 10) < 10) {
			return '0' + num
		}

		return num;
	}

    gulp.task(appName + '-HTML-to-JS', function () { // gulp tasks portal-HTML-to-JS

        // console.log('Executing task index-HTML-templateCache...');

        var pathToHtml = ['src/' + appName + '/scripts/app/**/*.html'];

		var d = new Date();
		var date = left_pad(d.getDate());
		var month = left_pad(d.getMonth() + 1);
		var year = left_pad(d.getFullYear());
		var hours = left_pad(d.getHours());
		var minutes = left_pad(d.getMinutes());

        let build_date = hours + ':' + minutes + ', ' + date + '/' + month + '/' + year;

        return gulp.src(pathToHtml)
            .pipe(htmlmin({collapseWhitespace: true}))
            .on('error', function (error) {
                console.error('\nError on HTML minifaction: \n', error.toString());
                this.emit('end');
            })
            .pipe(ngHtml2Js({
                moduleName: 'finmars.' + appName
            }))
            .pipe(concat('templates.min.js'))
			.pipe(replace(/__BUILD_DATE__/g, build_date))
            .pipe(uglify())
            .pipe(gulp.dest('src/' + appName + '/scripts/'))
			.pipe(gulp.dest('dist/' + appName + '/scripts/'));
    });

    /* gulp.task('portal-forum-HTML-to-JS', function () {
        return forumTasks.forumHtmlToJs();
    });

    gulp.task('portal-profile-HTML-to-JS', function () {
        return profileTasks.profileHtmlToJs();
    }); */

    // gulp.task(appName + '-js-min', gulp.series(appName + '-HTML-to-JS', function () {
	/* JavaScript minification starts from shell

	gulp.task(appName + '-js-min', function () { // gulp tasks portal-js-min

		console.log('PROJECT_ENV: ' + PROJECT_ENV);
        console.log('API_HOST: ' + API_HOST);
        console.log('AUTHORIZER_URL: ' + AUTHORIZER_URL);
        console.log('WS_HOST: ' + WS_HOST);
        console.log('HEALTHCHECK_HOST: ' + HEALTHCHECK_HOST);
        // console.log('API_HOST: ' + API_HOST);

        var pathToJS = ['src/' + appName + '/scripts/main.js'];

        /!* var d = new Date();
        var date = left_pad(d.getDate());
        var month = left_pad(d.getMonth() + 1);
        var year = left_pad(d.getFullYear());
        var hours = left_pad(d.getHours());
        var minutes = left_pad(d.getMinutes());

        let build_date = hours + ':' + minutes + ', ' + date + '/' + month + '/' + year; *!/

        let bundles = browserify(pathToJS, {debug: false, cache: {}, packageCache: {}});

        if (PROJECT_ENV === 'production') {

        	let presets = [
        		["@babel/preset-env", {useBuiltIns: "entry"}]
			];

			bundles = bundles.transform("babelify", {presets: presets});

		}

        return bundles
            .bundle()
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber({
                errorHandler: function (error) {
                    console.log("error", error)
                }
            }))
            .pipe(source('bundled.js'))
            .pipe(buffer())
            .pipe(preprocess())
            .pipe(gulpif(PROJECT_ENV === 'local', replace(/__API_HOST__/g, API_HOST)))
            .pipe(gulpif(PROJECT_ENV === 'local', replace(/__AUTHORIZER_URL__/g, AUTHORIZER_URL)))
            .pipe(gulpif(PROJECT_ENV === 'local', replace(/__WS_HOST__/g, WS_HOST)))
            .pipe(gulpif(PROJECT_ENV === 'local', replace(/__HEALTHCHECK_HOST__/g, HEALTHCHECK_HOST)))
            // .pipe(replace(/__BUILD_DATE__/g, build_date))
            .pipe(replace(/__PROJECT_ENV__/g, PROJECT_ENV))
            .pipe(gulpif(PROJECT_ENV === 'production', uglify()))
            .pipe(gulpif(PROJECT_ENV === 'production', stripDebug()))
            .pipe(rename({basename: 'main', suffix: '.min'}))
            .pipe(plumber.stop())
            .pipe(gulp.dest('dist/' + appName + '/scripts/'))
            .pipe(livereload());

    }); */

	gulp.task('js-min', function () {
		return commonTasks.minAllScripts();
	});

    gulp.task(appName + '-img-copy', function () {

        var pathToImg = ['src/' + appName + '/content/img/**/*'];

        return gulp.src(pathToImg)
            .pipe(gulp.dest('dist/' + appName + '/content/img/'));

    });

    gulp.task(appName + '-fonts-copy', function () {

        var pathToFonts = ['src/' + appName + '/content/fonts/**/*'];

        return gulp.src(pathToFonts)
            .pipe(gulp.dest('dist/' + appName + '/content/fonts/'));

    });

    gulp.task(appName + '-watch-All', function () {

    	livereload.listen();

        gulp.watch('src/' + appName + '/**/*.less', gulp.series(appName + '-less-to-css-min'));
        gulp.watch(['src/' + appName + '/**/*.js', '!src/' + appName + '/**/templates.min.js'], gulp.series('js-min'));
        gulp.watch('src/' + appName + '/**/*.html', gulp.series(appName + '-HTML-to-JS'));
        gulp.watch('src/index.html', gulp.series('main-html-min'));

    });

    /* gulp.task('forum-watch-All', function () {
        gulp.watch('src/' + appName + '/!**!/!*.less', gulp.series(appName + '-less-to-css-min'));
        gulp.watch('src/forum/!**!/!*.js', gulp.series(appName + '-js-min'));
        gulp.watch('src/forum/!**!/!*.html', gulp.series('portal-forum-HTML-to-JS', appName + '-js-min'));
    }); */

     gulp.task(appName + '-min-All', gulp.parallel(
        // appName + '-html-min',
		'main-html-min',
        // appName + '-HTML-to-JS',
		// appName + '-js-min-All',
		// appName + '-html-js-min',
		// gulp.series(appName + '-HTML-to-JS', 'js-min'),
		appName + '-HTML-to-JS',
        appName + '-less-to-css-min',
        // appName + '-js-min',
        appName + '-json-min',
        appName + '-img-copy',
        appName + '-fonts-copy'));

})();