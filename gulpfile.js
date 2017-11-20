const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');

gulp.task('build', ['js']);

gulp.task('js', function () {
    return browserify({
        entries: [
            './src/public/js/game.js',
            './src/public/js/client.js',
            './src/public/js/play-state.js',
            './src/public/js/player.js'
        ],
        debug: true
    })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('main.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) {
            console.error(err.message);
            this.emit('end');
        })
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./src/public/js/'))
        .pipe(livereload());
});

gulp.task('server', ['build'], function () {
    nodemon({ script: './src/app.js' })
        .on('restart', function () {
            console.log('Restarted');
        });
});

gulp.task('watch', ['build'], function () {
    gulp.watch([
        './src/**/*.js',
        '!./src/public/js/main.min.js'
    ], ['js']);
});

gulp.task('default', ['server', 'watch']);
