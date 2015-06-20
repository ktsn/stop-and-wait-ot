var del = require('del');
var run = require('run-sequence');

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(require('./tsconfig.json').compilerOptions);
var webpack = require('gulp-webpack');
var mocha = require('gulp-mocha');

gulp.task('clean', function(done) {
  del(['.tmp', 'build'], done);
});

gulp.task('copy', function() {
  return gulp.src(['app/www/**/*.html', 'app/www/css/**/*.css'], { base: 'app' })
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  var tsResult = gulp.src(['typings/tsd.d.ts', 'app/ts/**/*.ts'], { base: 'app/ts' })
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('build/js'));
});

gulp.task('prepare-ts', function() {
  return gulp.src(['typings/tsd.d.ts', 'app/ts/**/*.ts'], { base: './' })
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('.tmp'));
});

gulp.task('prepare-copy', function() {
  return gulp.src(['app/www/js/**/*.js'], { base: './' })
    .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack', ['prepare-ts', 'prepare-copy'], function() {
  return gulp.src(['.tmp/app/www/js/index.js'])
    .pipe(webpack({
      output: {
        filename: 'index.js'
      }
    }))
    .pipe(gulp.dest('build/www/js'));
});

gulp.task('test', ['clean'], function() {
  return gulp.src(['app/ts/**/*.ts', 'typings/tsd.d.ts', 'test/**/*.ts'], { base: './' })
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('.tmp'))
    .pipe(mocha());
});

gulp.task('build', ['clean'], function() {
  run('scripts', 'webpack', 'copy');
});
