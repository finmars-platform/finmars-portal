/**
 * Created by szhitenev on 09.03.2016.
 */
(function () {

    'use strict';

    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var stripDebug = require('gulp-strip-debug');
    var concat = require('gulp-concat');
    var minifyCSS = require('gulp-minify-css');
    var minifyHTML = require('gulp-minify-html');
    var less = require('gulp-less');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    var rename = require('gulp-rename');
    var livereload = require('gulp-livereload');
    var htmlmin = require('gulp-htmlmin');
    var ngHtml2Js = require('gulp-ng-html2js');
    var gulpif = require('gulp-if');
    var minimist = require('minimist');
    var replace = require('gulp-replace');

    //js
    var plumber = require('gulp-plumber');
    var preprocess = require('gulp-preprocess');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify');

    var forumTasks = require('./forum.js');
    var profileTasks = require('./profile.js');

    var PROJECT_ENV = process.env.PROJECT_ENV || 'local';
    var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';

    var appName = 'portal';

    gulp.task(appName + '-less-to-css-min', function () {

        var pathToLess = ['src/' + appName + '/content/less/imports.less'];

        return gulp.src(pathToLess)
            .pipe(less())
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber())
            .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
            .pipe(minifyCSS())
            .pipe(rename('main.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));

    });

    gulp.task(appName + '-html-min', function () {

        var pathToHTML = ['src/*.html'];

        return gulp.src(pathToHTML)
            .pipe(replace(/{hash}/g, new Date().getTime()))
            .pipe(minifyHTML())
            .pipe(gulp.dest('dist/'));

    });

    gulp.task(appName + '-json-min', function () {

        var pathToJSON = ['src/' + appName + '/content/json/**/*.json'];

        return gulp.src(pathToJSON)
            .pipe(gulp.dest('dist/' + appName + '/content/json/'));

    });

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
                moduleName: appName
            }))
            .pipe(concat('templates.min.js'))
			.pipe(replace(/__BUILD_DATE__/g, build_date))
            .pipe(uglify())
            .pipe(gulp.dest('src/' + appName + '/scripts/'))
			.pipe(gulp.dest('dist/' + appName + '/scripts/'));
    });

    gulp.task('portal-forum-HTML-to-JS', function () {
        forumTasks.forumHtmlToJs();
    });

    gulp.task('portal-profile-HTML-to-JS', function () {
        profileTasks.forumHtmlToJs();
    });

    function left_pad(num) {

        if (parseInt(num, 10) < 10) {
            return '0' + num
        }

        return num;
    }

    let consoleProd = function () {
		console.log('Production build', PROJECT_ENV);
	};

    // gulp.task(appName + '-js-min', gulp.series(appName + '-HTML-to-JS', function () {
	gulp.task(appName + '-js-min', function () { // gulp tasks portal-js-min

		console.log('PROJECT_ENV: ' + PROJECT_ENV);
        console.log('API_HOST: ' + API_HOST);
        // console.log('API_HOST: ' + API_HOST);

        var pathToJS = ['src/' + appName + '/scripts/main.js'];

        /* var d = new Date();
        var date = left_pad(d.getDate());
        var month = left_pad(d.getMonth() + 1);
        var year = left_pad(d.getFullYear());
        var hours = left_pad(d.getHours());
        var minutes = left_pad(d.getMinutes());

        let build_date = hours + ':' + minutes + ', ' + date + '/' + month + '/' + year; */

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
            // .pipe(replace(/__BUILD_DATE__/g, build_date))
            .pipe(replace(/__PROJECT_ENV__/g, PROJECT_ENV))
            .pipe(gulpif(PROJECT_ENV === 'production', uglify()))
            .pipe(gulpif(PROJECT_ENV === 'production', stripDebug()))
            .pipe(rename({basename: 'main', suffix: '.min'}))
            .pipe(plumber.stop())
            .pipe(gulp.dest('dist/' + appName + '/scripts/'))
            .pipe(livereload());

    });

    /* Does not needed after portal-js-min stopped calling portal-HTML-to-JS

    gulp.task(appName + '-only-js-min', function () { // gulp task portal-only-js-min
        // gulp.task(appName + '-js-min', function () {
        var pathToJS = ['src/' + appName + '/scripts/main.js'];

        console.log('PROJECT_ENV: ' + PROJECT_ENV);

        var d = new Date();
        var date = left_pad(d.getDate());
        var month = left_pad(d.getMonth() + 1);
        var year = left_pad(d.getFullYear());
        var hours = left_pad(d.getHours());
        var minutes = left_pad(d.getMinutes());

        var build_date = hours + ':' + minutes + ', ' + date + '/' + month + '/' + year;

        return browserify(pathToJS)
            .bundle()
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber())
            .pipe(source('bundled.js'))
            .pipe(buffer())
            .pipe(preprocess())
            .pipe(gulpif(PROJECT_ENV === 'local', replace(/__API_HOST__/g, API_HOST)))
            .pipe(replace(/__BUILD_DATE__/g, build_date))
            .pipe(replace(/__PROJECT_ENV__/g, PROJECT_ENV))
            .pipe(gulpif(PROJECT_ENV === 'production', uglify()))
            .pipe(rename({basename: 'main', suffix: '.min'}))
            .on('error', function (error) {
                console.error('\nError on JS minification: \n', error.toString());
                this.emit('end');
            })
            .pipe(gulp.dest('dist/' + appName + '/scripts/'))
            .pipe(livereload());

    }); */

    gulp.task(appName + '-js-min-All', gulp.series(appName + '-HTML-to-JS', appName + '-js-min'));

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
        gulp.watch('src/' + appName + '/**/*.js', gulp.series(appName + '-js-min'));
        gulp.watch('src/' + appName + '/**/*.html', gulp.series(appName + '-HTML-to-JS'));
        gulp.watch('src/index.html', gulp.series(appName + '-html-min'));
    });
    gulp.task('forum-watch-All', function () {
        gulp.watch('src/' + appName + '/**/*.less', gulp.series(appName + '-less-to-css-min'));
        gulp.watch('src/forum/**/*.js', gulp.series(appName + '-js-min'));
        gulp.watch('src/forum/**/*.html', gulp.series('portal-forum-HTML-to-JS', appName + '-js-min'));
    });

    gulp.task(appName + '-min-All', gulp.parallel(
        appName + '-html-min',
        appName + '-HTML-to-JS',
        appName + '-less-to-css-min',
        appName + '-js-min',
        appName + '-json-min',
        appName + '-img-copy',
        appName + '-fonts-copy'));
}());