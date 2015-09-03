/* global APP_NAMESPACE */
'use strict';

var _ = require('lodash');

var global = require('../../../../lib/browser/global');
var namespace = require('../../../../lib/browser/namespace');

module.exports = {
  'exports an object': function (test) {
    test.ok(_.isObject(namespace), 'should export an object');
    test.done();
  },
  'assigned to flag variable': function (test) {
    test.ok(namespace === global[APP_NAMESPACE]);
    test.done();
  }
};
