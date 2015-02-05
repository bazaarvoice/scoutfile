'use strict';

var _ = require('lodash');

var globalObject = require('../../../../lib/browser/global');
var BV = require('../../../../lib/browser/bv');

var globalBV = {
  foo: 'bar',
  applesauce: {
    chutney: 'puree'
  }
};

module.exports = {
  'exports an object': function (test) {
    test.ok(_.isObject(BV), 'should export an object');
    test.done();
  },

  'if `BV` is defined on the global object': {
    setUp: function (callback) {
      globalObject.BV = globalBV;

      // re-require `BV`
      delete require.cache[require.resolve('../../../../lib/browser/bv')];
      BV = require('../../../../lib/browser/bv');

      callback();
    },

    tearDown: function (callback) {
      try {
        delete globalObject.BV;
      } catch (e) {
        // IE8 workaround
        globalObject.BV = undefined;
      }

      // re-require `BV`
      delete require.cache[require.resolve('../../../../lib/browser/bv')];
      BV = require('../../../../lib/browser/bv');

      callback();
    },

    'it does not destroy the original global.BV properties`': function (test) {
      _.forOwn(globalBV, function (val, key) {
        test.strictEqual(BV[key], val);
      });

      test.done();
    }
  }
};
