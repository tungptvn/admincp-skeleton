var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var runSequence = require('run-sequence');
gulp.copy=function(src,dest){
    return gulp.src(src, {base:"."})
        .pipe(gulp.dest(dest));
};


gulp.task('deploy', function(callback) {
  runSequence(
    // ['copy-assets','copy-pages','copy-images'],
              'push-to-gh-pages',
              callback);
});

// gulp.task('copy-assets', function() {
    
//     return gulp.src(['assets/**/*']).pipe(gulp.dest('dist/assets'));

// });
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
