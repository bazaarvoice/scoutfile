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
  appModules: [],
  entry: [
    path.join(
      __dirname, 'webpack-kernel-loader!'
    ) + path.join(
      __dirname, 'browser/kernel'
    )
  ],
  output: {
    filename: 'scout.js',
    sourcePrefix: ''
  },
  plugins: [],
  resolve: {
    root: process.cwd()
  },
  resolveLoader: {
    root: path.resolve(__dirname, '../node_modules/')
  },
  preLoaders: [
    {
      test: /kernel\.js/,
      loader: path.join(__dirname, 'webpack-kernel-loader')
    }
  ]
};

var optionsDefaults = {
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
 * @param {object[]|object} options.banner - banner definitions
 * @param {object[]} options.appModules - commonjs application modules to bundle
 * @param {string} options.appModules[].name - unique module name
 * @param {string} options.appModules[].path - commonjs module path
 * @param {string} options.webPackOptions - Overrides for Webpack options
 * @param {function} [callback] - node-style callback for the generated scout
 *   file source
 *
 * @returns {BluebirdPromise} promise of the generated scout file source
 */
module.exports.generate = function generateScout(options, callback) {
  if (!_.isObject(options)) {
    throw new Error('`options` is required');
  }

  _.defaults(options, optionsDefaults);
  var webpackOptions = _.cloneDeep(overrides);

  webpackOptions.scout = {
    appModules: options.appModules
  };

  // each build gets its own unique directory
  webpackOptions.output.path = '/build' + buildNumber;
  buildNumber++;

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

  if (options.banner) {
    if (!_.isArray(options.banner)) {
      options.banner = [ options.banner ];
    }

    options.banner.forEach(function (banner) {
      webpackOptions.plugins.push(
        new webpack.BannerPlugin(banner.content, banner.options || {})
      );
    });
  }

  var appConfig;

  try {
    appConfig = JSON.stringify(options.appConfig || {});
  }
  catch (e) {
    throw new Error('Cannot stringify appConfig value');
  }

  options.flags = _.defaults(options.flags || {}, {
    APP_NAMESPACE: JSON.stringify(options.namespace || DEFAULT_NAMESPACE),
    SCOUTFILE_APP_CONFIG: appConfig
  });

  webpackOptions.plugins.push(
    new webpack.DefinePlugin(options.flags)
  );

  // Any overrides for webpackOptions that are passed in to the task should be
  // applied last of all. Yes, this can break things, especially if passing in
  // a plugin array to stomp on the one constructed above, but it seems the most
  // consistent behavior.
  _.merge(webpackOptions, options.webpackOptions);

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

          // Ok, so depending on options, we could have one or two files here:
          // (a) the Javascript file, and (b) a source map file that will only
          // be present if the user provided a value for webpackOptions.devtool.
          var filenames = memfs.readdirSync(webpackOptions.output.path);

          // Ensure this array is [javascriptFilename, sourceMapFilename] or
          // [javascriptFilename].
          filenames = _.sortBy(filenames, function (filename) {
            return (filename === webpackOptions.output.filename) ? 0 : 1;
          });

          // Load in the code and delete the files.
          var sources = _.map(filenames, function (filename) {
            var filePath = path.join(webpackOptions.output.path, filename);
            var fileContents = memfs.readFileSync(filePath).toString();
            memfs.unlinkSync(filePath);
            return fileContents;
          });

          // Clean up the directory.
          memfs.rmdirSync(webpackOptions.output.path);

          // Send back the generated source (and source map if present).
          //
          // For backwards compatibility we only send an array if there is in
          // fact a source map. Otherwise just return the source as a string.
          //
          // The pre-source-map-capable code returned only the source string,
          // but Promises only allow one return argument so we can't just return
          // two strings without using a structure like an array. This sort of
          // situation is exactly why people should just use callbacks.
          if (sources.length > 1) {
            // Send an array.
            resolve(sources);
          }
          else {
            // Send the source string to maintain backwards compatibility with
            // older versions.
            resolve(sources[0]);
          }
        }).
        catch(function (err) {
          reject(err);
        });
    });

  return promise.nodeify(callback);
};
