module.exports = function () {
    gconf.gulp.task('less', function () {
        return gconf.gulp.src('src/public/stylesheets/*.less')
            .pipe(gconf.glp.sourcemaps.init())
            .pipe(gconf.glp.less({
                pretty:true, //Опция, чтоы html не был в одну строку
                'include css': true
            }))
            /*            .pipe(gconf.glp.autoprefixer({
                            browsers: ['last 10 versions'] //Опция для префиксов
                        }))*/
            .on('error', gconf.glp.notify.onError({
                message: "Error: <% error.message %>",
                title: "Style Error"
            }))
            .pipe(gconf.glp.csso())//Минификация кода
            .pipe(gconf.glp.sourcemaps.write())
            .pipe(gconf.gulp.dest('build/public/stylesheets'))
        /*.pipe(gconf.browserSync.reload({
            stream: true
        }));*/
    });
    //
    // gconf.gulp.task('less', function () {
    //     return gconf.gulp.src('src/public/stylesheets/slick/*.less')
    //         .pipe(gconf.glp.sourcemaps.init())
    //         .pipe(gconf.glp.less({
    //             pretty:true, //Опция, чтоы html не был в одну строку
    //             'include css': true
    //         }))
    //         .on('error', gconf.glp.notify.onError({
    //             message: "Error: <% error.message %>",
    //             title: "Style Error"
    //         }))
    //         .pipe(gconf.glp.csso())//Минификация кода
    //         .pipe(gconf.glp.sourcemaps.write())
    //         .pipe(gconf.gulp.dest('build/public/stylesheets/slick'))
    // });
}