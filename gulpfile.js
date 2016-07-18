const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('default', () => {
  return browserify('./source.js')
         .transform(babelify, { presets: ["es2015", "react"]})
         .bundle()
         .pipe(source('build.js'))
         .pipe(gulp.dest('./public/js/'));
});
