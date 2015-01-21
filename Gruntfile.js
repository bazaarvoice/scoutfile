'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true,
      },
      all: [
        '**/*.js',
        '!node_modules/'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
