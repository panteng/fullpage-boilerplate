'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var streamSeries = require('stream-series');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var vendors = require('./config/vendors');

/* ============================================================================================================
============================================ For Development ==================================================
=============================================================================================================*/

// compile sass and save the result as bundles/bundle.css
gulp.task('compile-sass', function () {
    var cssVendors = vendors.stylesheets;

    return streamSeries(
        gulp.src(cssVendors),
        gulp.src('scss/main.scss')
            .pipe(plumber({
                errorHandler: errorAlert
            }))
            .pipe(sass({
                outputStyle: 'expanded'
            }))
            .pipe(autoprefixer())
        )
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('bundles'))
        .pipe(browserSync.stream());
 });
 
 // bundle CommonJS modules and save the result as bundles/bundle.js
 gulp.task('bundle-js', function () {
    var jsVendors = vendors.javascripts;

    return streamSeries(
        gulp.src(jsVendors),
        gulp.src('javascripts/main.js')
            .pipe(plumber({
                errorHandler: errorAlert
            }))
            .pipe(browserify({
                transform: ['partialify'],
                debug: true
            }))
        )
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('bundles'));
 });

// copy font vendors from node_modules to fonts folder
gulp.task('get-fonts', function () {
    var fontVendors = vendors.fonts;
    
    return gulp.src(fontVendors)
        .pipe(gulp.dest('fonts'));
});

// optimize images
gulp.task('optimize-images', function () {
    return gulp.src('images/**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('images'));
});

// inject bundle.css and bundle.js into index.html
gulp.task('inject', function () {
    var target = gulp.src('index.html');
    var assets = gulp.src([
        'bundles/bundle.css',
        'bundles/bundle.js'
    ], {
        read: false
    });
    return target
        .pipe(inject(assets, {
            addRootSlash: false,
            removeTags: false
        }))
        .pipe(gulp.dest('./'));
});


// watch files and run corresponding task(s) once files are added, removed or edited.
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    
    gulp.watch('scss/**/*.scss', ['compile-sass']);
    gulp.watch('javascripts/**/*', ['bundle-js']);
    
    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch('bundles/bundle.js').on('change', browserSync.reload);
    gulp.watch('fonts/*').on('change', browserSync.reload);
    gulp.watch('images/*').on('change', browserSync.reload);
});

// delete files under bundles folder
gulp.task('clean-bundles', function(cb) {
    return del([
        'bundles/**/*'
    ], cb);
});

// development tasks combination
gulp.task('dev', function (cb) {
    runSequence(['clean-bundles'], ['compile-sass', 'bundle-js', 'get-fonts', 'optimize-images'], 'inject', 'watch', cb)
});

// default task
gulp.task('default', ['dev']);



/* ============================================================================================================
================================================= For Production ==============================================
=============================================================================================================*/

// minify bundle.css and save as bundle.min.css
gulp.task('minify-css', function () {
    return gulp.src('bundles/bundle.css')
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('bundles'))
});

// uglify bundle.js and save as bundle.min.js
gulp.task('uglify-js', function () {
    return gulp.src('bundles/bundle.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('bundles'))
});

// inject bundle.min.css and bundle.min.js into index.html
gulp.task('inject-min', function () {
    var target = gulp.src('index.html');
    var assets = gulp.src([
        'bundles/bundle.min.css',
        'bundles/bundle.min.js'
    ], {
        read: false
    });
    return target
        .pipe(inject(assets, {
            addRootSlash: false,
            removeTags: false
        }))
        .pipe(gulp.dest('./'));
});

// production tasks combination
gulp.task('prod',  function (cb) {
    runSequence(['minify-css', 'uglify-js'], 'inject-min', cb);
});



/* ===============================================
 ================== Functions ====================
 ================================================*/

// handle errors
function errorAlert(error){
    notify.onError({
        title: "Error in plugin '" + error.plugin + "'",
        message: 'Check your terminal',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
}