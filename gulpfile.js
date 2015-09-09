var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');



/**
 * Build Tasks
 */

gulp.task('scripts', function(){
	var b = browserify();
	b.transform(reactify); // use the reactify transform
	b.add('lib/console.js');
	return b.bundle()
				.pipe(source('console.js'))
				.pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'scripts'])
