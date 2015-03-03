'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('scoutfile');

  grunt.initConfig({
    scoutfile: {
      example: {
        src: [
          {
            name: 'MyApp',
            path: './app-scout.js'
          }
        ],
        dest: './build/scout.js',
        pretty: true
      }
    }
  });
};
