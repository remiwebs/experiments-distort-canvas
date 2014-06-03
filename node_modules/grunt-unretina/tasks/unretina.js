/*
 * grunt-unretina
 * https://github.com/ramonfritsch/grunt-unretina
 *
 * Copyright (c) 2014 Ramon Fritsch
 * Licensed under the MIT license.
 */

'use strict';

var async = require("async");
var gm = require("gm");
var mkdirp = require("mkdirp");
var path = require("path");
var os = require("os");

module.exports = function(grunt) {

  grunt.registerMultiTask('unretina', 'Resizes @2x images to standard resolution', function() {
    var done = this.async();
    var options = this.options({
      overwrite: true,
      quality: 1,
      concurrency: os.cpus().length,
      sufixes: [
        "@2x",
        "-hd"
      ]
    });

    var series = [];

    this.files.forEach(function (f) {
      // Fail for more than one source file per file group.
      if (f.src.length !== 1)
      {
        return grunt.fail.fatal("Can not resize more than one image per destination.\n You need to use a different 'files' format in your Gruntfile.");
      }

      var dirname = path.dirname(f.dest);
      var filepath = f.src[0];
      var name = path.basename(f.dest);

      options.sufixes.forEach(function (sufix) {
        name = name.split(sufix).join("");
      });

      var dest = path.join(dirname, name);

      // Prevent failing if destination directory does not exist.
      if (!grunt.file.isDir(dirname))
      {
        grunt.file.mkdir(dirname);
      }

      if (options.overwrite === false && grunt.file.isFile(f.dest))
      {
        return grunt.log.writeln("Skipping " + filepath + " because destination already exists.\n Set options 'overwrite' to true to enable overwriting of files.");
      }

      series.push(function(callback) {
        gm(filepath)
        .size(function(err, size) {
          if (err) {
            grunt.fatal("Failed to query image dimensions of '" + filepath + "'.\n " + err);
            callback(err);

          } else {
            if (size.width % 2 !== 0 || size.height % 2 !== 0)
            {
              grunt.log.warn("Image " + filepath + " has dimentions not divisible by 2");
              return callback();
            }

            gm(filepath)
            .quality(options.quality * 100)
            .resize("50%", "50%", "!")
            .write(dest, function (err) {
              if (err)
              {
                grunt.fail.warn(err.message);
              }
              else
              {
                grunt.log.ok("Image " + filepath + " resized to " + dest);
              }

              return callback();
            });
          }
        });
      });
    });

    async.parallelLimit(series, options.concurrency, done);
  });
};
