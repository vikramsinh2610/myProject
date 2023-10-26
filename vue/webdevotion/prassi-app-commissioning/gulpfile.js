const { src, dest, series } = require('gulp');
const deleteLines = require('gulp-delete-lines');
const bump = require('gulp-bump');
const minimist = require('minimist');

function stripjs() {
  return src('src/**/*.js')
    .pipe(
      deleteLines({
        filters: [/this.\$utils.log/i],
      }),
    )
    .pipe(dest('src'));
}

function stripvue() {
  return src('src/**/*.vue')
    .pipe(
      deleteLines({
        filters: [/this.\$utils.log/i],
      }),
    )
    .pipe(dest('src'));
}

const knownOptions = {
  string: 'vers',
  default: 'minor',
};
const options = minimist(process.argv.slice(2), knownOptions);

function bumpdevtcw() {
  return src('./src/plugins/env/env.dev.tcw.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpdevsheltia() {
  return src('./src/plugins/env/env.dev.sheltia.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenv() {
  return src('./src/plugins/env/env.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenvlocal() {
  return src('./src/plugins/env/env.local.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenvprodtcw() {
  return src('./src/plugins/env/env.prod.tcw.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenvprodsheltia() {
  return src('./src/plugins/env/env.prod.sheltia.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenvstagetcw() {
  return src('./src/plugins/env/env.stage.tcw.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpenvstagesheltia() {
  return src('./src/plugins/env/env.stage.sheltia.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/plugins/env'));
}

function bumpversion() {
  return src('./src/store/version/state.js')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./src/store/version'));
}

function bumppackage() {
  return src('./package.json')
    .pipe(bump({ type: options.vers }))
    .pipe(dest('./'));
}

exports.logs = series(stripjs, stripvue);
exports.bump = series(
  bumpdevtcw,
  bumpdevsheltia,
  bumpenv,
  bumpenvlocal,
  bumpenvprodtcw,
  bumpenvprodsheltia,
  bumpenvstagetcw,
  bumpenvstagesheltia,
  bumpversion,
  bumppackage,
);
