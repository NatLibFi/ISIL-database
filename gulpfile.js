const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

gulp.task('default', () => {
  return browserify('./src/client/admin/source.js')
         .transform(babelify, { presets: ["es2015", "react"]})
         .bundle()
         .pipe(source('build.js'))
         .pipe(buffer())
         .pipe(uglify())
         .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', () => {
  gulp.watch('./src/client/**/*.js', ['default']);
});
