'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'unit-tests': './test/fixtures/browser/unit-tests.runner.js',
    'lib.loader.loadscript': './test/fixtures/browser/lib.loader.loadscript.js',
    'lib.loader.loadstylesheet':
      'file?name=lib.loader.loadstylesheet.css!' +
      './test/fixtures/browser/lib.loader.loadstylesheet.css'
  },
  output: {
    path: path.resolve(__dirname, '.'),
    filename: '[name].bundle.js'
  },
  node: {
    /* eslint-disable camelcase */
    child_process: 'empty',
    /* eslint-enable camelcase */
    fs: 'empty',
    module: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_NAMESPACE: JSON.stringify('NS')
    })
  ]
};
