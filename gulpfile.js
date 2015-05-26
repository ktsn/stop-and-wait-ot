var del = require('del');
var run = require('run-sequence');

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(require('./tsconfig.json').compilerOptions);
var mocha = require('gulp-mocha');

gulp.task('clean', function(done) {
  del(['.tmp', 'build'], done);
});

gulp.task('scripts', function() {
  var tsResult = gulp.src(['typings/tsd.d.ts', 'app/ts/**/*.ts'], { base: 'app/ts' })
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('build/js'));
});

gulp.task('test', ['clean'], function() {
  return gulp.src(['app/ts/**/*.ts', 'typings/tsd.d.ts', 'test/**/*.ts'], { base: './' })
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('.tmp'))
    .pipe(mocha());
});

gulp.task('build', ['clean'], function() {
  run('scripts');
});
