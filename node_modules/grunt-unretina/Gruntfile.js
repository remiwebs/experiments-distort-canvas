/*
 * grunt-unretina
 * https://github.com/ramonfritsch/grunt-unretina
 *
 * Copyright (c) 2014 Ramon Fritsch
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp'],
    },

    unretina: {
      test: {
        files: [
          { src: "**/*@2x.png", dest: "tmp/", expand: true, cwd: "test/fixtures/" }
        ],
      }
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', [
    'clean', 
    'unretina', 
    'nodeunit'
  ]);

  grunt.registerTask('default', ['jshint', 'test']);
};
