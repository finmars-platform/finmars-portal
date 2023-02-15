/**
 * Created by mevstratov on 18.05.2021
 */
(function () {

	'use strict';

	const gulp = require('gulp');
	const uglify = require('gulp-uglify');
	const concat = require('gulp-concat');
	const stripDebug = require('gulp-strip-debug');
	const gulpif = require('gulp-if');
	const livereload = require('gulp-livereload');
	const rename = require('gulp-rename');
	const replace = require('gulp-replace');

	const minifyHTML = require('gulp-minify-html');
	const htmlmin = require('gulp-htmlmin');
	const ngHtml2Js = require('gulp-ng-html2js');
	const plumber = require('gulp-plumber');

	//<editor-fold desc="JavaScript">
	const preprocess = require('gulp-preprocess');
	const source = require('vinyl-source-stream');
	const buffer = require('vinyl-buffer');
	const browserify = require('browserify');
	const esmify = require('esmify');
	//</editor-fold>

	const less = require('gulp-less');
	const postcss = require('gulp-postcss');
	const autoprefixer = require('autoprefixer');
	const minifyCSS = require('gulp-minify-css');

	const PROJECT_ENV = process.env.PROJECT_ENV || 'local';
	const API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';
	const AUTHORIZER_URL = process.env.AUTHORIZER_URL || 'http://0.0.0.0:8083/authorizer';
	const WS_HOST = process.env.WS_HOST || 'ws://0.0.0.0:6969';
	const HEALTHCHECK_HOST = process.env.HEALTHCHECK_HOST || '';

	function mainHtmlMin () {
		var pathToHTML = ['src/*.html'];

		return gulp.src(pathToHTML)
			.pipe(replace(/{hash}/g, new Date().getTime()))
			.pipe(minifyHTML())
			.pipe(gulp.dest('dist/'));
	}

	gulp.task('common-main-html-min', () => {
		return mainHtmlMin();
	});

	const htmlToJs = (pathsToHtml, appName, angularModuleName) => {

		return gulp.src(pathsToHtml)
			.pipe(htmlmin({collapseWhitespace: true}))
			.on('error', function (error) {
				console.error('\nError on HTML minifaction: \n', error.toString());
				this.emit('end');
			})
			.pipe(ngHtml2Js({
				moduleName: angularModuleName || appName
			}))
			.pipe(concat('templates.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('src/' + appName + '/scripts/'))
			.pipe(gulp.dest('dist/' + appName + '/scripts/'));

	};

	/** finmars angular module inside shell directory is root module. Scripts bundling starts from it. */
	const minAllScripts = () => {

		var pathToJS = ['src/shell/scripts/main.js'];

		let browserifyOpts = {debug: false, cache: {}, packageCache: {}};

		if (PROJECT_ENV === 'local') browserifyOpts.plugin = [esmify];

		let bundles = browserify(pathToJS, browserifyOpts);

		if (PROJECT_ENV === 'production' || PROJECT_ENV === 'development') {

			const presets = [
				["@babel/preset-env", {useBuiltIns: "entry", corejs: "^2.1.4"}, 'module:@babel/helper-module-imports'],
			];

			bundles = bundles.transform("babelify", {presets: presets});

		}
		/* console.log("PROJECT_ENV ", PROJECT_ENV);
		console.log("API_HOST ", API_HOST);
		console.log("AUTHORIZER_URL ", AUTHORIZER_URL); */

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
			.pipe(gulp.dest('dist/shell/scripts/'))
			.pipe(livereload());

	};

	const lessToCssMin = (pathToLess, appName) => {

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

	};

	/*gulp.task('common-portal-less-to-css-min', function () {
		return portalTasks.lessToCssMin();
	});*/

	module.exports = {
		mainHtmlMin: mainHtmlMin,
		minAllScripts: minAllScripts,
		htmlToJs: htmlToJs,
		lessToCssMin: lessToCssMin
	}

})();