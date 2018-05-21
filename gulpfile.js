'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

const DEFAULT_PATHS = {
  src_js: './src/assets/js/', //path for user JS files (not watching for folders)
  src_js_vendor: './src/assets/js/vendors/', //path for vendors JS
  src_js_plugins: './src/assets/js/plugins/', //path for plugins JS
  src_css_sass_folder: './src/assets/css/sass/', //path for SASS files folder
  src_css_sass: './src/assets/css/styles.scss', //path for main SCSS file
  src_css_vendor: './src/assets/css/vendors/', //path for vendors CSS
  dist_js: './dist/assets/js/', //path where put compiled and minified JS
  dist_css_sass: './dist/assets/css/', //path where put compiled and minified CSS
}

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('sass_styles', function () {
  return gulp.src(DEFAULT_PATHS.src_css_sass)
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(csso())
    .pipe(gulp.dest(DEFAULT_PATHS.dist_css_sass))
});

gulp.task('vendor_styles', function () {
  return gulp.src(DEFAULT_PATHS.src_css_vendor + '**/*.css')
    .pipe(concat('vendors.min.css'))
    .pipe(gulp.dest(DEFAULT_PATHS.dist_css_sass))
});

gulp.task('scripts', function() {
  return gulp.src(DEFAULT_PATHS.src_js + '*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify().on('error', function(uglify) {
      console.error(uglify.message);
      this.emit('end');
    }))
    .pipe(gulp.dest(DEFAULT_PATHS.dist_js))
});

gulp.task('vendor_scripts', function() {
  return gulp.src(DEFAULT_PATHS.src_js_vendor + '**/*.js')
    .pipe(concat('vendor.min.js'))
    .pipe(uglify().on('error', function(uglify) {
      console.error(uglify.message);
      this.emit('end');
    }))
    .pipe(gulp.dest(DEFAULT_PATHS.dist_js))
});

gulp.task('plugins_scripts', function() {
  return gulp.src(DEFAULT_PATHS.src_js_plugins + '**/*.js')
    .pipe(concat('plugins.min.js'))
    .pipe(uglify().on('error', function(uglify) {
      console.error(uglify.message);
      this.emit('end');
    }))
    .pipe(gulp.dest(DEFAULT_PATHS.dist_js))
});

gulp.task('html_pages', function() {
  return gulp.src(['./src/**/*.html'])
    /*.pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))*/
    .pipe(gulp.dest('./dist'));
});

gulp.task('php_pages', function() {
  return gulp.src(['./src/**/*.php'])
    /*.pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))*/
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => del(['dist']));

gulp.task('watchAll', ['clean'], function () {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});

gulp.task('default', function(){
  gulp.src(DEFAULT_PATHS.src_css_sass_folder + '**/*.scss')
  .pipe(watch(DEFAULT_PATHS.src_css_sass_folder + '**/*.scss', function() {
    gulp.start('sass_styles');
  }));

  gulp.src(DEFAULT_PATHS.src_css_vendor + '**/*.css')
  .pipe(watch(DEFAULT_PATHS.src_css_vendor + '**/*.css', function() {
    gulp.start('vendor_styles');
  }));

  gulp.src(DEFAULT_PATHS.src_js + '*.js')
  .pipe(watch(DEFAULT_PATHS.src_js + '*.js', function() {
    gulp.start('scripts');
  }));

  gulp.src(DEFAULT_PATHS.src_js_vendor + '**/*.js')
  .pipe(watch(DEFAULT_PATHS.src_js_vendor + '**/*.js', function() {
    gulp.start('vendor_scripts');
  }));

  gulp.src(DEFAULT_PATHS.src_js_plugins + '**/*.js')
  .pipe(watch(DEFAULT_PATHS.src_js_plugins + '**/*.js', function() {
    gulp.start('plugins_scripts');
  }));

  gulp.src('./src/**/*.html')
  .pipe(watch('./src/**/*.html', function() {
    gulp.start('html_pages');
  }));

  gulp.src('./src/**/*.php')
  .pipe(watch('./src/**/*.php', function() {
    gulp.start('php_pages');
  }));
})