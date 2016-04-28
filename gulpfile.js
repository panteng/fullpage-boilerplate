'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var buffer = require('vinyl-buffer');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var factor = require('factor-bundle');
var gulp = require('gulp');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

/* ============================================================================================================
 ============================================ For Development ==================================================
 =============================================================================================================*/

// compile sass and save the result as bundles/bundle.css
gulp.task('compile-sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .on('error', errorAlert)
        .pipe(autoprefixer())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('bundles'))
        .pipe(browserSync.stream());
});

// bundle CommonJS modules and save the result as bundles/bundle.js
gulp.task('bundle-js', function () {
    return browserify({
        entries: [
            'javascripts/main.js'
        ],
        debug: true
    })
        .bundle()
        .on('error', errorAlert)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('bundles/'));
});

// watch files and run corresponding task(s) once files are added, removed or edited.
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('scss/**/*.scss', ['compile-sass']);
    gulp.watch('javascripts/**/*.js', ['bundle-js']);

    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('bundles/*.js').on('change', browserSync.reload);
    gulp.watch('fonts/*').on('change', browserSync.reload);
    gulp.watch('images/*').on('change', browserSync.reload);
});

// clean old files under bundles folder
gulp.task('clean-bundles', function(cb) {
    return del([
        'bundles/*'
    ], cb);
});

// development tasks combination
gulp.task('dev', function (cb) {
    runSequence(['clean-bundles'], ['compile-sass', 'bundle-js'], 'watch', cb)
});

// default task
gulp.task('default', ['dev']);


/* ============================================================================================================
 ================================================ For Production ==============================================
 =============================================================================================================*/

// minify stylesheets under bundles folder
gulp.task('minify-css', function () {
    return gulp.src('bundles/bundle.css')
        .pipe(cleanCSS({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('bundles'));
});

// uglify javascripts under bundles folder
gulp.task('uglify-js', function () {
    return gulp.src('bundles/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('bundles'));
});

// remove unnecessary map files under bundles folder
gulp.task('remove-maps', function (cb) {
    return del([
        'bundles/*.map'
    ], cb);
});

// production tasks combination
gulp.task('prod', function (cb) {
    runSequence(['minify-css', 'uglify-js', 'remove-maps'], cb);
});


/* ============================================================================================================
 =============================================== Functions ====================================================
 =============================================================================================================*/

// handle errors
function errorAlert(error) {
    notify.onError({
        title: 'Error in Gulp Tasks',
        message: 'Check your terminal.',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
}