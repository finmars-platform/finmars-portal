/**
 * Created by sergey on 30.07.16.
 */
(function(){

    'use strict';

    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var less = require('gulp-less');
    var postcss = require('gulp-postcss');
    var rename = require('gulp-rename');
    var htmlmin = require('gulp-htmlmin');
    var ngHtml2Js = require('gulp-ng-html2js');

    //js
    var plumber = require('gulp-plumber');
    var preprocess = require('gulp-preprocess');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify');

    var appName = 'forum';

    function forumHtmlToJs () {
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
    }

    gulp.task(appName + '-HTML-to-JS', function () {
        forumHtmlToJs();
    });

    module.exports = {
        forumHtmlToJs: forumHtmlToJs
    }

}());

