'use strict';

var path = require('path');
var fs = require('fs');

var jsdom = require('jsdom');
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

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
    },
    jscs: {
      all: [
        'lib/**/*.js',
        'test/**/*.js',
        '!lib/browser/util.js',
        '!test/fixtures/browser/nodeunit.js',
        '!test/scratch/**/*'
      ],
      options: {
        config: '.jscsrc'
      }
    }
  });

  grunt.registerTask('nodeunit-browser', function () {
    var done = this.async();
    var html = fs.readFileSync(
      path.resolve(__dirname, 'test/fixtures/browser/index.html'),
      { encoding : 'utf8' }
    );

    serveTests(function (err, server) {
      if (err) {
        grunt.log.error(err);
        return done(err);
      }

      grunt.log.ok('Loading tests with jsdom');

      jsdom.env({
        url: 'http://localhost:8080',
        created: function (err, window) {
          jsdom.getVirtualConsole(window).on('log', function (msg) {
            console.log('jsdom:', msg);
          });

          window.isJsdom = true;

          window.onTestsComplete = function (err, results) {
            var $ = window.$;
            var resultText = $('#nodeunit-testresult').text();

            grunt.log[err ? 'error' : 'ok'](resultText);

            if (err) {
              $('#nodeunit-tests > li.fail > strong').each(function () {
                grunt.log.error($(this).text());
              });
            }

            done(err);
          };
        },
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script']
        }
      });
    });
  });

  grunt.registerTask('serve-test', function () {
    this.async();
    serveTests(function () {});
  });

  function serveTests (cb) {
    var webpackTestConfig = require('./test/fixtures/browser/unit-tests.webpack.config.js');
    var compiler = webpack(webpackTestConfig);

    var server = new WebpackDevServer(compiler, {
      contentBase: path.resolve(__dirname, 'test/fixtures/browser'),
      quiet: true
    });

    server.listen(8080, 'localhost', function (err) {
      if (err) {
        return cb(err);
      }

      grunt.log.ok('Serving browser unit tests at http://localhost:8080');
      cb(null, server);
    });
  }

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('test', ['jshint', 'nodeunit', 'nodeunit-browser']);
  grunt.registerTask('default', ['test', 'jscs']);
};
