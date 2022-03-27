const gulp = require('gulp4');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
function styles(){
    return gulp.src("./public/stylesheets/*.less")
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest("./public/stylesheets/"));
}
function scripts(){
    return gulp.src("./public/javascripts/*.js", {sourcemaps: true})
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest("./public/javascripts/"));
}
gulp.task("default", gulp.series(scripts, styles));