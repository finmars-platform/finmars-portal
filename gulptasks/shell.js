/**
 * Created by mevstratov on 18.05.2021
 */
(function () {

	'use strict';

	const gulp = require('gulp');
	const livereload = require('gulp-livereload');

	const commonTasks = require('./common.js');

	const appName = 'shell';

	gulp.task('main-html-min', () => {
		return commonTasks.mainHtmlMin();
	});

	const htmlToJs = () => {
		const pathToHtml = ['src/' + appName + '/scripts/app/**/*.html'];
		return commonTasks.htmlToJs(pathToHtml, appName, 'finmars');
	};

	gulp.task(appName + '-HTML-to-JS', () => {
		return htmlToJs();
	});

	gulp.task('portal-less-to-css-min', function () { // for now .less files only inside directory portal
		var pathToLess = ['src/portal/content/less/imports.less'];
		return commonTasks.lessToCssMin(pathToLess, 'portal');
	});

	gulp.task('js-min', function () {
		return commonTasks.minAllScripts();
	});

	gulp.task(appName + '-img-copy', function () {

		var pathToImg = ['src/' + appName + '/content/img/**/*'];

		return gulp.src(pathToImg)
			.pipe(gulp.dest('dist/' + appName + '/content/img/'));

	});

	gulp.task(appName + '-min-All', gulp.parallel(
		'main-html-min', // actually mininifies only index.html
		gulp.series(appName + '-HTML-to-JS', 'js-min'),
		'portal-less-to-css-min',
		appName + '-img-copy'
	));

	 gulp.task(appName + '-watch-All', () => {

		livereload.listen();

		gulp.watch('src/portal/**/*.less', gulp.series('portal-less-to-css-min'));
		gulp.watch(['src/' + appName + '/**/*.js', '!src/' + appName + '/**/templates.min.js'], gulp.series('js-min'));
		gulp.watch('src/' + appName + '/**/*.html', gulp.series(appName + '-HTML-to-JS'));
		gulp.watch('src/index.html', gulp.series('common-main-html-min'));

	});

})();