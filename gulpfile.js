'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

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

gulp.task('styles', function () {
  return gulp.src('./src/sass/styles.scss')
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(csso())
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('pages', function() {
  return gulp.src(['./src/**/*.html'])
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
  gulp.watch('./src/**', ['watchAll']);
})