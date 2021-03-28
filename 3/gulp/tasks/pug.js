module.exports = function () {
    gconf.gulp.task('pug', function () {
        return gconf.gulp.src('src/views/*.pug')
            .pipe(gconf.glp.pug({
                pretty:true //Опция, чтоы html не был в одну строку
            }))
            .pipe(gconf.gulp.dest('build/views'))
            /*.pipe(gconf.browserSync.reload({
                stream: true
            }))*/;
    })
}