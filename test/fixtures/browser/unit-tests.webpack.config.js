'use strict';

module.exports = {
  entry: {
    'unit-tests': './test/fixtures/browser/unit-tests.runner.js',
    'lib.loader.loadscript': './test/fixtures/browser/lib.loader.loadscript.js'
  },
  output: {
    path: './test/fixtures/browser/',
    filename: '[name].bundle.js'
  },
  node: {
    /* jshint camelcase: false */
    child_process: 'empty',
    /* jshint camelcase: true */
    fs: 'empty',
    module: 'empty'
  }
};
