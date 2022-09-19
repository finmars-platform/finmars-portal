/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    const gulp = require('gulp');
    const livereload = require('gulp-livereload');
    /* var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var less = require('gulp-less');
    var postcss = require('gulp-postcss');
    var rename = require('gulp-rename');
    var htmlmin = require('gulp-htmlmin');
    var ngHtml2Js = require('gulp-ng-html2js'); */

    //js
    /* var plumber = require('gulp-plumber');
    var preprocess = require('gulp-preprocess');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify'); */

    var commonTasks = require('./common.js');

    var appName = 'profile';
    /* function profileHtmlToJs () {
        // console.log('Executing task index-HTML-templateCache...');

        var pathToHtml = ['src/' + appName + '/scripts/app/!**!/!*.html'];

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
            .pipe(uglify())
            .pipe(gulp.dest('src/' + appName + '/scripts/'))
			.pipe(gulp.dest('dist/' + appName + '/scripts/'));
    } */
	gulp.task('portal-less-to-css-min', function () {
		var pathToLess = ['src/portal/content/less/imports.less'];
		return commonTasks.lessToCssMin(pathToLess, 'portal');
	});

    gulp.task(appName + '-HTML-to-JS', () => {

    	var pathToHtml = ['src/' + appName + '/scripts/app/**/*.html'];
		var angularModuleName = 'finmars.' + appName;

		return commonTasks.htmlToJs(pathToHtml, appName, angularModuleName);

	});

	gulp.task('js-min', function () {
		return commonTasks.minAllScripts();
	});

	gulp.task(appName + '-watch-All', () => {

		livereload.listen();

		gulp.watch('src/portal/**/*.less', gulp.series('portal-less-to-css-min'));
		gulp.watch(['src/' + appName + '/**/*.js', '!src/' + appName + '/**/templates.min.js'], gulp.series('js-min'));
		gulp.watch('src/' + appName + '/**/*.html', gulp.series(appName + '-HTML-to-JS'));

	});

	gulp.task(appName + '-min-All', gulp.parallel(
		appName + '-HTML-to-JS',
		'portal-less-to-css-min'));

})();

