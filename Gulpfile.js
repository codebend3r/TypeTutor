'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  pkg = require('./package.json'),
  config = {
    app: 'app',
    dev: 'builds/dev',
    prod: 'builds/prod',
    release: 'builds/release'
  },
  env = 'dev',
  connect = require('gulp-connect-multi'),
  devServer = connect(),
  prodServer = connect(),
  releaseServer = connect(),
  gulpif = require('gulp-if'),
  $ = require('gulp-load-plugins')()


//=============================================
// TASKS
//=============================================

gulp.task('set-to-dev', function () {
  env = 'dev';
});

gulp.task('set-to-prod', function () {
  env = 'prod';
});

gulp.task('set-to-release', function () {
  env = 'release';
});

// HTML
gulp.task('html', function () {
  return gulp.src([ config.app + '/**/*.html', config.app + '/*.html' ])
    // RELEASE
    .pipe(gulpif(env === 'release',
      $.usemin({
        css: [
          $.csso(),
          $.rev()
        ],
        js: [
          $.ngmin(),
          $.uglify(),
          $.rev()
        ]
      })
    ))
    .pipe(gulpif(env === 'release',
      gulp.dest(config.release)
    ))
    // PROD
    .pipe(gulpif(env === 'prod',
      $.usemin({
        css: [$.rev()],
        js: [$.rev()]
      })
    ))
    .pipe(gulpif(env === 'prod',
      gulp.dest(config.prod)
    ))
    // DEV
    .pipe(gulpif(env === 'dev',
      gulp.dest(config.dev)
    ));

});

// SASS
gulp.task('sass', function () {
  return gulp.src([config.app + '/sass/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.app + '/css'))
    .pipe($.size());
});

// CSS
gulp.task('css', [ 'sass' ], function () {
  return gulp.src([ config.app + '/css/**/*.css' ])
    .pipe(gulp.dest(config.dev + '/css/'))
    .pipe($.size());
});

// JS
gulp.task('scripts', function () {
  return gulp.src([ config.app + '/js/**/*.js' ])
    .pipe(gulp.dest(config.dev + '/js/'))
    .pipe($.size());

});

// Images
gulp.task('images', function () {
  return gulp.src(config.app + '/images/**/*.{png,jpg,gif}')
    /*
     .pipe($.imagemin({
     optimizationLevel: 1,
     progressive: true,
     interlaced: true
     }))
     */
    .pipe(gulpif(env === 'dev',
      gulp.dest(config.dev + '/images/')
    ))
    .pipe(gulpif(env === 'prod',
      gulp.dest(config.prod + '/images/')
    ))
    .pipe(gulpif(env === 'release',
      gulp.dest(config.release + '/images/')
    ))
    .pipe($.size());
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src(config.app + '/fonts/**/*')
    .pipe(gulpif(env === 'dev',
      gulp.dest(config.dev + '/fonts/')
    ))
    .pipe(gulpif(env === 'prod',
      gulp.dest(config.prod + '/fonts/')
    ))
    .pipe(gulpif(env === 'release',
      gulp.dest(config.release + '/fonts/')
    ))
    .pipe($.size());
});

// JS HINT
gulp.task('hint', function () {
  gulp.src([config.app + '/js/**/*.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Clean
gulp.task('clean', function () {
  return gulp.src([config.dev, 'app/css/'], { read: false }).pipe($.clean({force: false}));
});

gulp.task('clean-dev', function () {
  return gulp.src([config.dev], { read: false }).pipe($.clean({force: false}));
});

gulp.task('clean-prod', function () {
  return gulp.src([config.prod], { read: false }).pipe($.clean({force: false}));
});

gulp.task('clean-release', function () {
  return gulp.src([config.release], { read: false }).pipe($.clean({force: false}));
});

// Build
gulp.task('build', [
    'set-to-dev',
    'html',
    'css',
    'scripts',
    'images',
    'fonts'
  ]
);

gulp.task('build-prod', [
  'set-to-prod',
  'css',
  'html',
  'images',
  'fonts'
]);

gulp.task('build-release', [
  'set-to-release',
  'css',
  'html',
  'images',
  'fonts'
]);

// Watch
gulp.task('watch', [ 'connect' ], function () {

  gulp.watch([
      config.app + '/*.html',
      config.app + '/**/*.html',
      config.app + '/sass/**/*.scss',
      config.app + '/js/**/*.js',
      config.app + '/fonts/**/*.js',
      config.app + '/images/**/*.{png,jpg,gif}'
  ], function (event) {
    return gulp.src(event.path)
      .pipe(gulpif(env === 'dev',
        devServer.reload()
      ))
      .pipe(gulpif(env === 'prod',
        prodServer.reload()
      ))
      .pipe(gulpif(env === 'release',
        releaseServer.reload()
      ))
  });

  // Watch all .html files
  gulp.watch([config.app + '/**/*.html', config.app + '/*.html'], [ 'set-to-dev', 'html' ]);

  // Watch .scss files
  gulp.watch(config.app + '/sass/**/*.scss', [ 'set-to-dev', 'css' ]);

  // Watch .js files
  gulp.watch([config.app + '/js/**/*.js', config.app + '/js/*.js'], [ 'set-to-dev', 'scripts' ]);

  // Watch image files
  gulp.watch(config.app + '/images/**/*.{png,jpg,gif}', [ 'set-to-dev', 'images']);

});

// Servers
gulp.task('connect', [ 'build' ], devServer.server({
  root: [ config.dev ],
  port: 9000,
  livereload: true
}));

gulp.task('connect-prod', prodServer.server({
  root: [ config.prod ],
  port: 9001,
  livereload: true
}));

gulp.task('connect-release', releaseServer.server({
  root: [ config.release ],
  port: 9002,
  livereload: true
}));

gulp.task('default', [ 'watch' ]);

module.exports = gulp; // for chrome gulp dev-tools