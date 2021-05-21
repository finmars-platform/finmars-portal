/**
 * Created by mevstratov on 18.05.2021
 */
(function () {

	'use strict';

	const gulp = require('gulp');
	const uglify = require('gulp-uglify');
	const concat = require('gulp-concat');
	const livereload = require('gulp-livereload');
	const rename = require('gulp-rename');

	const minifyHTML = require('gulp-minify-html');
	const htmlmin = require('gulp-htmlmin');
	const ngHtml2Js = require('gulp-ng-html2js');

	const less = require('gulp-less');
	const postcss = require('gulp-postcss');
	const autoprefixer = require('autoprefixer');
	const minifyCSS = require('gulp-minify-css');

	gulp.task('main-html-min', () => {

		var pathToHTML = ['src/*.html'];

		return gulp.src(pathToHTML)
			.pipe(replace(/{hash}/g, new Date().getTime()))
			.pipe(minifyHTML())
			.pipe(gulp.dest('dist/'));

	})

	const htmlToJs = (pathsToHtml, appName, angularModuleName) => {
		console.log(pathsToHtml, appName, angularModuleName);
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

	const initWatcher = appName => {

		livereload.listen();

		gulp.watch('src/' + appName + '/**/*.less', gulp.series(appName + '-less-to-css-min'));
		gulp.watch('src/' + appName + '/**/*.js', gulp.series(appName + '-js-min'));
		gulp.watch('src/' + appName + '/**/*.html', gulp.series(appName + '-HTML-to-JS'));
		gulp.watch('src/index.html', gulp.series('main-html-min'));

	};

	module.exports = {
		htmlToJs: htmlToJs,
		lessToCssMin: lessToCssMin,
		initWatcher: initWatcher
	};

})();