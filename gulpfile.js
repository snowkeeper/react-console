var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var babel = require('babelify');
var babel = require("gulp-babel");


/**
 * Build Tasks
 */

gulp.task("jsx", function () {
  return gulp.src("src/console.js")
    .pipe(babel())
    .pipe(gulp.dest("lib"));
});

gulp.task('scripts', function(){
	var b = browserify();
	b.transform(babel); // use the reactify transform
	b.add('src/console.js');
	return b.bundle()
				.pipe(source('console.js'))
				.pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'jsx', 'scripts'])
