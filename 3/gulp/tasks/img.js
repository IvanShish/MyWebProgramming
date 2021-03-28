module.exports = function () {
    gconf.gulp.task('img', function () {
        return gconf.gulp.src('src/public/images/*.jpg')
            .pipe(gconf.gulp.dest('build/public/images'));
    });
    gconf.gulp.task('fav', function () {
        return gconf.gulp.src('src/public/images/*.ico')
            .pipe(gconf.gulp.dest('build/public/images/'));
    });
}