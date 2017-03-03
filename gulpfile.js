var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var runSequence = require('run-sequence');
gulp.copy=function(src,dest){
    return gulp.src(src, {base:"."})
        .pipe(gulp.dest(dest));
};


gulp.task('deploy', function(callback) {
  runSequence(
    ['copy-database-mockup'],
              'push-to-gh-pages',
              callback);
});

gulp.task('copy-database-mockup', function() {
    
    return gulp.src(['database-mockup/**/*']).pipe(gulp.dest('dist/database-mockup'));

});
// gulp.task('copy-pages', function() {
    
//     return gulp.src(['pages/**/*']).pipe(gulp.dest('dist/pages'));

// });
// gulp.task('copy-images', function() {
    
//     return gulp.src(['images/**/*']).pipe(gulp.dest('dist/images'));

// });
gulp.task('push-to-gh-pages', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
