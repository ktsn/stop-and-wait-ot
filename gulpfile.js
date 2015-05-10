var del = require('del');
var run = require('run-sequence');

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(require('./tsconfig.json').compilerOptions);

gulp.task('clean', function(done) {
  del('build/**/*', done);
});

gulp.task('scripts', function() {
  var tsResult = gulp.src('app/ts/**/*.ts', { base: 'app/ts' })
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('build/js'));
});

gulp.task('build', ['clean'], function() {
  run('scripts');
});
