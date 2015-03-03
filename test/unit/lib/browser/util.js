'use strict';

var util = require('../../../../lib/browser/util');

module.exports = {
  'lib/browser/util': function(test) {
    test.ok(typeof util._.each === 'function');
    test.ok(typeof util._.forEach === 'function');
    test.ok(typeof util._.indexOf === 'function');
    test.ok(typeof util._.extend === 'function');
    test.ok(typeof util._.isFunction === 'function');
    test.done();
  }
};