const gulp = require('gulp');
const browserify = require('browserify');
const eslint = require('gulp-eslint');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');

gulp.task('build', ['lint', 'js']);

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!**/*.min.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js', function () {
    return browserify({
        entries: ['./public/js/client.js'],
        debug: true
    })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('client.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({ mangle: false }))
        .on('error', function (err) {
            console.error(err.message);
        })
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(livereload());
});

gulp.task('server', ['build'], function () {
    nodemon({ script: 'app.js' })
        .on('restart', function() {
            console.log('Restarted');
        });
});

gulp.task('watch', ['build'], function() {
    gulp.watch('./public/js/*.js', ['js']);
});

gulp.task('default', ['server', 'watch']);
