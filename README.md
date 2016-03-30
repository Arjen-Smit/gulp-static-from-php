# gulp-static-from-php [![npm version](https://badge.fury.io/js/gulp-static-from-php.svg)](https://badge.fury.io/js/gulp-static-from-php)

A static site generator that uses php to render pages

## install
```
npm install --save gulp-static-from-php
```

## sitemap.json
```
{
	"home": "index.html",
	"about": "about.html",
	"introduction": "blog/introduction.html"
}
```

## gulp task
```
gulp.task('static-generator', function() {
	gulp.src('src/sitemap.json')
		.pipe(staticFromPhp({
			phpfile: 'src/index.php'
		}))
		.pipe(gulp.dest('./web'));
});
```

By default the plugin fires index.php in the run directory, but with the setting `phpfile` a custom php file can be called

Inside php additional runtime information can be found in 
```
var_dump($GLOBALS["argv"]);
```
will result in 
```
array(3) {
  [0]=>
  string(13) "src/index.php"
  [1]=>
  string(11) "--page=home"
  [2]=>
  string(17) "--file=index.html"
}
```
