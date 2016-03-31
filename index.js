'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var shell = require('shelljs');
var cheerio = require("cheerio");
var crypto = require('crypto');

var PLUGIN_NAME = 'gulp-static-from-php';
var DOCUMENT_LIST = {'/': null};

var doRequest = function doRequest(processor, url) {
    var html = shell.exec("php " + processor, {silent:true});
    return html.stdout;
}

var scrubLinks = function scrubLinks(html) {
    var $ = cheerio.load(html);
    $("a").each(function() {
        var link = $(this).attr("href");
        if(link.charAt(0) == "/" && typeof DOCUMENT_LIST[link] == "undefined") {
            DOCUMENT_LIST[link] = null;
        }
    });
}

var getLink = function getLink() {
    var link = false;
    Object.keys(DOCUMENT_LIST).forEach(function(key,index) {
        if (DOCUMENT_LIST[key] == null) {
            link = key;
            return true;
        }
    }.bind(link));
    return link;
}

var generateHtaccess = function generateHtaccess() {

}

var gulpStaticFromPhp = function gulpStaticFromPhp(options, sync) {
    return through.obj(function(file, enc, cb) {
        var processor = file.path;

        var link;
        while((link = getLink()) !== false ) {
            var html = doRequest(processor, link);
            var filename = "pages/" + crypto.createHash('md5').update(html).digest('hex') + ".html";

            this.push(new gutil.File({
                cwd: "",
                base: "",
                path: filename,
                contents: new Buffer(html)
            }));

            DOCUMENT_LIST[link] = filename;
            scrubLinks(html);
        }

        var htaccess = generateHtaccess();


        cb(null);
    });
}

module.exports = gulpStaticFromPhp;