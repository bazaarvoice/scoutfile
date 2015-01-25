'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true,
      },
      all: [
        'lib/**/*.js',
        'test/**/*.js',
        '!test/scratch/**/*',
        '!test/fixtures/browser/nodeunit.js'
      ]
    },
    nodeunit: {
      all: [
        'test/**/*.js',
        '!test/fixtures/**/*',
        '!test/scratch/**/*',
        '!test/unit/lib/browser/**/*'
      ],
      options: {
        reporter: 'minimal'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('default', ['test']);
};
