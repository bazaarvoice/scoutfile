'use strict';

var _ = require('lodash');
var async = require('async');
var generator = require('../lib/index').generate;

module.exports = function (grunt) {
  grunt.registerMultiTask(
    'scoutfile',
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
          pretty: !!file.orig.pretty,
          flags: file.orig.flags,
          namespace: file.orig.namespace,
          appConfig: file.orig.appConfig,
          banner: file.orig.banner,
          webpackOptions: file.orig.webpackOptions
        }, function (err, source) {
          // If the error is in the webpack compilation then there should be a
          // stats object to investigate. Otherwise this is some other sort of
          // exception.
          var stats = err && err.webpackStats;
          var error;
          var sourceMap;

          if (err) {
            if (stats && stats.errors && stats.errors.length) {
              error = new Error(stats.errors.length + 'webpack errors');
              error.message = stats.errors.join('\n---\n');
              error.webpackStats = stats;

              return done(error);
            }

            if (stats && stats.warnings && stats.warnings.length) {
              error = new Error(stats.warnings.length + 'webpack warnings');
              error.message = stats.warnings.join('\n---\n');
              error.webpackStats = stats;

              return done(error);
            }

            return done(err);
          }

          // Do we have a source and a source map? If so we're getting an array
          // rather than a string.
          if (_.isArray(source)) {
            sourceMap = source[1];
            source = source[0];
          }

          grunt.file.write(dest, source);
          grunt.log.writeln('Created', dest);

          if (sourceMap) {
            if (file.sourceMapDest) {
              grunt.file.write(file.sourceMapDest, sourceMap);
              grunt.log.writeln('Created', file.sourceMapDest);
            }
            else {
              return done(new Error(
                'Source map requested, but sourceMapDest is not configured.'
              ));
            }
          }

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
