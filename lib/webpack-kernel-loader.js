/**
 * A [webpack loader](http://webpack.github.io/docs/loaders.html) that is called
 * for `lib/kernel` only. Its purpose is to make it possible to control when the
 * application modules are executed as well as to ensure any exceptions they may
 * throw are caught.
 *
 * @module
 */
'use strict';

var _ = require('lodash');
var pathResolve = require('path').resolve;

// use Function.prototype.toString to obtain a template for requiring
// application scout modules
var requireWrapper =
  function () {
    try {
      require('<%= path %>');
    } catch (e) {
      console.error(
        'Failed to load Bazaarvoice module `<%= name %>`', e.message);
    }
  }.
  toString().
  replace(/^function \(\) {\n/, '').
  replace(/}$/, '');

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
  var toRequire = this.options.bvapi.appModules.map(function (module) {
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
