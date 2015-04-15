/**
 * Scout file generator.
 *
 * @module
 */
'use strict';

var _ = require('lodash');
var MemoryFileSystem = require('memory-fs');
var BluebirdPromise = require('bluebird');
var webpack = require('webpack');
var path = require('path');

var memfs = new MemoryFileSystem();
var buildNumber = 0;

var DEFAULT_NAMESPACE = 'APP';

var overrides = {
  entry: [
    __dirname + '/webpack-kernel-loader!' + __dirname + '/browser/kernel'
  ],
  output: {
    filename: 'scout.js',
    sourcePrefix: ''
  },
  resolve: {
    root: process.cwd()
  },
  resolveLoader: {
    root: path.resolve(__dirname, '../node_modules/')
  },
  outputFileSystem: memfs,
  preLoaders: [
    {
      test: /kernel\.js/,
      loader: __dirname + '/webpack-kernel-loader'
    }
  ]
};

var defaults = {
  appModules: [],
  webpackOptions: {}
};

var webpackFailureTemplate = _.template(
  'Webpack failed with <%= errors.length %> errors and ' +
  '<%= warnings.length %> warnings'
);

/**
 * Generate a scout file
 *
 * Given a configuration object, generate a scout file and return its source
 * asynchronously as a string.
 *
 * @param {object} options - Configuration for the built scout
 * @param {object[]} options.appModules - commonjs application modules to bundle
 * @param {string} options.appModules[].name - unique module name
 * @param {string} options.appModules[].path - commonjs module path
 * @param {function} [callback] - node-style callback for the generated scout
 *          file source
 *
 * @returns {BluebirdPromise} promise of the generated scout file source
 */
module.exports.generate = function generateScout(options, callback) {
  if (!_.isObject(options)) {
    throw new Error('`options` is required');
  }

  _.defaults(options, defaults);

  var webpackOptions = _.cloneDeep(overrides);
  _.merge(webpackOptions, defaults, options.webpackOptions);

  webpackOptions.scout = {
    appModules: options.appModules
  };

  // each build gets its own unique directory
  webpackOptions.output.path = '/build' + buildNumber;
  buildNumber++;

  webpackOptions.plugins = options.webpackOptions.plugins || [];

  // uglify by default
  if (!options.pretty) {
    webpackOptions.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));
  }
  else {
    webpackOptions.output.pathinfo = true;
  }

  var appConfig;

  try {
    appConfig = JSON.stringify(options.appConfig || {});
  }
  catch (e) {
    throw new Error('Cannot stringify appConfig value');
  }

  options.flags = _.defaults(options.flags || {}, {
    APP_NAMESPACE : JSON.stringify(options.namespace || DEFAULT_NAMESPACE),
    SCOUTFILE_APP_CONFIG : appConfig
  });

  webpackOptions.plugins.push(
    new webpack.DefinePlugin(options.flags)
  );

  // initialize webpack and use an in-memory filesystem
  var compiler = webpack(webpackOptions);
  compiler.outputFileSystem = memfs;

  var promise = new BluebirdPromise(function (resolve, reject) {
      BluebirdPromise.promisify(compiler.run, compiler)().
        then(function (stats) {
          var error;

          stats = stats.toJson();

          // annoyingly, this is necessary to detect all errors and warnings
          // http://webpack.github.io/docs/node.js-api.html#error-handling
          if (stats.errors.length || stats.warnings.length) {
            error = new Error(webpackFailureTemplate(stats));
            error.webpackStats = stats;

            return reject(error);
          }

          // look up the bundle, read it as a string, and delete the file
          var bundlePath =
            webpackOptions.output.path + '/' + webpackOptions.output.filename;
          var src = memfs.readFileSync(bundlePath);
          memfs.unlinkSync(bundlePath);
          memfs.rmdirSync(webpackOptions.output.path);

          resolve(src.toString());
        }).
        catch(function (err) {
          reject(err);
        });
    });

  return promise.nodeify(callback);
};
