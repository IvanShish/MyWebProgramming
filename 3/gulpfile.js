'use strict';

global.gconf = {
    gulp: (require('gulp')),
    glp: require('gulp-load-plugins')(),
    browserSync: require('browser-sync').create(),

    path: {
        tasks: require('./gulp/config/tasks.js')
    }
}

gconf.path.tasks.forEach((taskPath) => {
    require(taskPath)();
})

gconf.gulp.task('default', gconf.gulp.series(
    gconf.gulp.parallel('pug', 'less', 'scripts', 'scripts:lib', 'app', 'routes', 'img', 'fav', 'watch')
    // gconf.gulp.parallel('watch')
))