/**
 * A [webpack loader](http://webpack.github.io/docs/loaders.html) that is called
 * for `lib/browser/kernel` only. Its purpose is to make it possible to control
 * when the application modules are executed as well as to ensure any exceptions
 * they may throw are caught.
 *
 * @module
 */
'use strict';

var _ = require('lodash');
var pathResolve = require('path').resolve;

// NOTE: For compatibility with IE8/9 we check if console.error exists before
//       logging. If we can't log the error, re-throw it. This is OK since we
//       are already handling an error from the module require which means if
//       an error is thrown, this app is going to break regardless.
var requireWrapper =
  function () {
    try {
      require('<%= path %>');
    }
    catch (e) {
      if (console && console.error) {
        console.error('Failed to load module `<%= name %>`',  e.message)
      }
      else {
        throw e
      }
    }
  }.
  toString().
  replace(/^function \(\) {\n/, '').
  replace(/}$/, '');

// Obtain a template for requiring app scout modules by using the above
// wrapper's string representation.
var appRequireTemplate = _.template(requireWrapper);

/**
 * Add static `require` calls to the kernel for each application module
 *
 * For each application module, a `require` call is generated, wrapped in a
 * `try`/`catch` block.
 *
 * FIXME:
 * - sourcemap support
 * - factor catch body out as an error handler fn that takes the name and
 *   exception
 */
module.exports = function (source) {
  var root = process.cwd();
  // emit a try/catch block for each application module
  var toRequire = this.options.scout.appModules.map(function (module) {
    if (!(_.isString(module.path) && _.isString(module.name))) {
      throw new Error('Application modules must specify `path` and `name`');
    }

    return appRequireTemplate({
      path: pathResolve(root, module.path),
      name: module.name
    });
  });

  // replace `/* APP_MODULES */` in the scout with a try/catch block for each
  // application module
  this.callback(null,
    source.replace(/\/\*\s?APP_MODULES\s?\*\//, toRequire.join('\n')));
};
