'use strict';

var async = require('async');
var generator = require('../lib/index').generate;
var path = require('path');

module.exports = function (grunt) {
  grunt.registerMultiTask(
    'bvscout',
    'Generate a scout file',
    function () {
      if (this.files.length < 1) {
        return grunt.fail.warn('at least one `src` is required');
      }

      var done = this.async();

      async.each(this.files, function (file, callback) {
        var dest = file.dest || process.cwd() + '/scout.js';

        generator({
          appModules: file.orig.src,
          pretty: !!file.orig.pretty
        }, function (err, output) {
          var stats = err && err.webpackStats;
          var error;

          if (err) {
            if (stats.errors && stats.errors.length) {
              error = new Error(stats.errors.length + 'webpack errors');
              error.message = stats.errors.join('\n---\n');
              error.webpackStats = stats;

              return done(error);
            }

            if (stats.warnings && stats.warnings.length) {
              error = new Error(stats.warnings.length + 'webpack warnings');
              error.message = stats.warnings.join('\n---\n');
              error.webpackStats = stats;

              return done(error);
            }

            return done(err);
          }

          grunt.file.write(dest, output);
          grunt.log.write('Created', dest);
          callback();
        });
      }, function (err, result) {
        if (err) {
          return done(err);
        }

        done();
      });
    });
};
