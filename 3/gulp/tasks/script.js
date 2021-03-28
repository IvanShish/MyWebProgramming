module.exports = function () {
    gconf.gulp.task('scripts:lib', function () {
        return gconf.gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/slick-carousel/slick/slick.min.js'])
            .pipe(gconf.glp.concat('libs.min.js'))
            .pipe(gconf.gulp.dest('build/public/javascripts'))
        /*.pipe(gconf.browserSync.reload({
            stream: true
        }));*/
    });

    gconf.gulp.task('scripts', function () {
        return gconf.gulp.src('src/public/javascripts/*.js')
            .pipe(gconf.glp.babel({
                presets: ['@babel/env']
            }))
            .pipe(gconf.gulp.dest('build/public/javascripts'))
        /*.pipe(gconf.browserSync.reload({
            stream: true
        }));*/
    });

    gconf.gulp.task('routes', () => {
        return gconf.gulp.src('src/routes/*.js')
            .pipe(gconf.glp.babel({
                presets: ['@babel/env']
            }))
            .pipe(gconf.gulp.dest('build/routes/'))
    });

    gconf.gulp.task('app', () => {
        return gconf.gulp.src('src/*.js')
            .pipe(gconf.glp.babel({
                presets: ['@babel/env']
            }))
            .pipe(gconf.gulp.dest('build/'))
    });
}