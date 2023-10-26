const { watch, src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const jsmin = require('gulp-jsmin');
const rename = require('gulp-rename');

function buildcss() {
  return src('src/views/scss/*.scss')
    .pipe(sass({ includePaths: './node_modules' }).on('error', sass.logError))
    .pipe(cssmin())
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(dest('src/public/static/css'));
}

function buildjs() {
  return src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'src/views/js/*.js',
  ])
    .pipe(jsmin())
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(dest('src/public/static/js'));
}

function watchFiles() {
  watch('src/views/scss/*.scss', buildcss);
  watch('src/views/js/*.js', buildjs);
}

exports.build = series(buildcss, buildjs);
exports.buildDevelopment = series(watchFiles);
