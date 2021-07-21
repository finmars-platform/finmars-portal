/**
 * Created by mevstratov on 20.07.201.
 */
(function(){

	'use strict';

	const gulp = require('gulp');
	const livereload = require('gulp-livereload');

	var commonTasks = require('./common.js');

	var appName = 'database';

	gulp.task('portal-less-to-css-min', function () {
		var pathToLess = ['src/portal/content/less/imports.less'];
		return commonTasks.lessToCssMin(pathToLess, appName);
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

