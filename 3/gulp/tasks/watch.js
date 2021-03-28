module.exports = function () {
    gconf.gulp.task('watch', function () {
        gconf.gulp.watch('src/views/*.pug', gconf.gulp.series('pug'));
        gconf.gulp.watch('src/public/stylesheets/*.less', gconf.gulp.series('less'));
        gconf.gulp.watch('src/public/javascripts/*.js', gconf.gulp.series('scripts'));
        gconf.gulp.watch('src/routes/*.js', gconf.gulp.series('routes'));
        gconf.gulp.watch('src/*.js', gconf.gulp.series('app'));
    })
}