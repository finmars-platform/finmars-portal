/**
 * Created by szhitenev on 09.03.2016.
 */
(function(){

    'use strict';

    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
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

    var environments = {
        string: 'env'
    };

    var PROJECT_ENV = process.env.PROJECT_ENV || 'development';
    var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8080';

    console.log('PROJECT_ENV: ' + PROJECT_ENV);
    console.log('API_HOST: ' + API_HOST);

    var appName = 'portal';

    gulp.task(appName + '-less-to-css-min', function(){

        var pathToLess = ['src/' + appName + '/content/less/imports.less'];

        return gulp.src(pathToLess)
            .pipe(less())
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber())
            .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions']})]))
            .pipe(minifyCSS())
            .pipe(rename('main.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/content/css/'));

    });

    gulp.task(appName + '-html-min', function(){

        var pathToHTML = ['src/*.html'];

        return gulp.src(pathToHTML)
            .pipe(replace(/{hash}/g, new Date().getTime()))
            .pipe(minifyHTML())
            .pipe(gulp.dest('dist/'));

    });

    gulp.task(appName + '-json-min', function(){

        var pathToJSON = ['src/' + appName + '/content/json/*.json'];

        return gulp.src(pathToJSON)
            .pipe(gulp.dest('dist/' + appName + '/content/json/'));

    });

    gulp.task(appName + '-HTML-to-JS', function () {

        // console.log('Executing task index-HTML-templateCache...');

        var pathToHtml = ['src/' + appName + '/scripts/app/**/*.html'];

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
            .pipe(gulp.dest('src/' + appName + '/scripts/'));

    });

    gulp.task('portal-forum-HTML-to-JS', function() {
        forumTasks.forumHtmlToJs();
    });

    gulp.task(appName + '-js-min', [appName + '-HTML-to-JS'], function(){

        var pathToJS = ['src/' + appName + '/scripts/main.js'];

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
            .pipe(replace(/__API_HOST__/g, API_HOST))
            .pipe(gulpif(PROJECT_ENV === 'production', uglify()))
            .pipe(rename({basename: 'main', suffix: '.min'}))
            .on('error', function (error) {
                console.error('\nError on JS minification: \n', error.toString());
                this.emit('end');
            })
            .pipe(gulp.dest('dist/' + appName + '/scripts/'))
            .pipe(livereload());
    });

    gulp.task(appName + '-img-copy', function(){

        var pathToImg = ['src/' + appName + '/content/img/**/*'];

        return gulp.src(pathToImg)
            .pipe(gulp.dest('dist/' + appName + '/content/img/'));

    });

    gulp.task(appName + '-fonts-copy', function(){

        var pathToFonts = ['src/' + appName + '/content/fonts/**/*'];

        return gulp.src(pathToFonts)
            .pipe(gulp.dest('dist/' + appName + '/content/fonts/'));

    });

    gulp.task(appName + '-watch-All', function(){
        livereload.listen();
        gulp.watch('src/' + appName + '/**/*.less', [appName + '-less-to-css-min']);
        gulp.watch('src/' + appName + '/**/*.js', [appName + '-js-min']);
        // gulp.watch('src/' + appName + '/**/*.html', [appName + '-HTML-to-JS', appName + '-js-min']);
        gulp.watch('src/index.html', [appName + '-html-min']);
    });
    gulp.task('forum-watch-All', function () {
        gulp.watch('src/' + appName + '/**/*.less', [appName + '-less-to-css-min']);
        gulp.watch('src/forum/**/*.js', [appName + '-js-min']);
        gulp.watch('src/forum/**/*.html', ['portal-forum-HTML-to-JS', appName + '-js-min']);
    });

    gulp.task(appName + '-min-All', [
        appName + '-html-min',
        appName + '-less-to-css-min',
        appName + '-js-min',
        appName + '-json-min',
        appName + '-img-copy',
        appName + '-fonts-copy']);
}());