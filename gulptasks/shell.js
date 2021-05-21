/**
 * Created by mevstratov on 18.05.2021
 */
(function () {

	'use strict';

	const gulp = require('gulp');
	const uglify = require('gulp-uglify');
	const stripDebug = require('gulp-strip-debug');
	const gulpif = require('gulp-if');
	const rename = require('gulp-rename');
	const livereload = require('gulp-livereload');
	const replace = require('gulp-replace');

	//<editor-fold desc="JavaScript">
	const plumber = require('gulp-plumber');
	const preprocess = require('gulp-preprocess');
	const source = require('vinyl-source-stream');
	const buffer = require('vinyl-buffer');
	const browserify = require('browserify');
	const esmify = require('esmify');
	//</editor-fold>

	const commonTasks = require('./common');

	const appName = 'shell';

	const PROJECT_ENV = process.env.PROJECT_ENV || 'local';
	const API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';
	const AUTHORIZER_URL = process.env.AUTHORIZER_URL || 'http://0.0.0.0:8083/authorizer';
	const WS_HOST = process.env.WS_HOST || 'ws://0.0.0.0:6969';
	const HEALTHCHECK_HOST = process.env.HEALTHCHECK_HOST || '';

	gulp.task(appName + '-less-to-css-min', function () {

		var pathToLess = ['src/' + appName + '/content/less/imports.less'];
		return commonTasks.lessToCssMin(pathToLess, appName);

	});

	const minAllScripts = () => {

		var pathToJS = ['src/' + appName + '/scripts/main.js'];

		let browserifyOpts = {debug: false, cache: {}, packageCache: {}};

		if (PROJECT_ENV === 'local') browserifyOpts.plugin = [esmify];

		let bundles = browserify(pathToJS, browserifyOpts);

		if (PROJECT_ENV === 'production') {

			const presets = [
				["@babel/preset-env", {useBuiltIns: "entry", corejs: "^2.1.4"}, 'module:@babel/helper-module-imports'],
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

	};

	gulp.task(appName + '-js-min', () => minAllScripts());

	const htmlToJs = () => {
		const pathToHtml = ['src/' + appName + '/scripts/app/**/*.html'];
		return commonTasks.htmlToJs(pathToHtml, appName, 'finmars');
	};

	gulp.task(appName + '-HTML-to-JS', () => {
		return htmlToJs();
	});

	gulp.task(appName + '-html-js-min', gulp.series(appName + '-HTML-to-JS', appName + '-js-min'))

	gulp.task(appName + '-min-All', gulp.parallel(
		'main-html-min', // actually mininifies only index.html
		appName + '-html-js-min'
	));

	/*const watchAll = () => {
		return commonTasks.initWatcher(gulp, appName);
	}*/

	gulp.task(appName + '-watch-All', () => {
		return commonTasks.initWatcher(appName);
	});

	module.exports = {
		minAllScripts: minAllScripts
	}

})();