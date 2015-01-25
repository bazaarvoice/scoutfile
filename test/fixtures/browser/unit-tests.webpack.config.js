'use strict';

module.exports = {
  entry: [
    './test/fixtures/browser/unit-tests.runner.js'
  ],
  output: {
    path: './test/fixtures/browser/',
    filename: 'unit-tests.bundle.js'
  },
  node: {
    /* jshint camelcase: false */
    child_process: 'empty',
    /* jshint camelcase: true */
    fs: 'empty',
    module: 'empty'
  }
};
