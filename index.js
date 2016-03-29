'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var shell = require('shelljs');

var PLUGIN_NAME = 'gulp-static-from-php';

var gulpStaticFromPhp = function gulpStaticFromPhp(options, sync) {

    options = options || {
        phpfile: 'index.php'
    };
    var phpfile = options.phpfile;

    return through.obj(function(file, enc, cb) {
        var pages = JSON.parse(file.contents)

        Object.keys(pages).forEach(function(page) {
            var request = ""
                + " --page=" + page
                + " --file=" + pages[page]
            var html = shell.exec("php " + phpfile + " " + request, {silent:true});

            this.push(new gutil.File({
                cwd: "",
                base: "",
                path: pages[page],
                contents: new Buffer(html.stdout)
            }));

        }.bind(this));

        cb(null, file);
    });
}

module.exports = gulpStaticFromPhp;