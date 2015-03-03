'use strict';

var _ = require('lodash');

var globalObject = require('../../../../lib/browser/global');
var NS = require('../../../../lib/browser/namespace');

var globalNS = {
  foo: 'bar',
  applesauce: {
    chutney: 'puree'
  }
};

module.exports = {
  'exports an object': function (test) {
    test.ok(_.isObject(NS), 'should export an object');
    test.done();
  },

  'if namespace is already a property on the global object': {
    setUp: function (callback) {
      globalObject.NS = globalNS;

      // re-require
      delete require.cache[
        require.resolve('../../../../lib/browser/namespace')
      ];
      NS = require('../../../../lib/browser/namespace');

      callback();
    },

    tearDown: function (callback) {
      try {
        delete globalObject.NS;
      }
      catch (e) {
        // IE8 workaround
        globalObject.NS = undefined;
      }

      // re-require
      delete require.cache[
        require.resolve('../../../../lib/browser/namespace')
      ];
      NS = require('../../../../lib/browser/namespace');

      callback();
    },

    'it does not destroy the original global namespace properties':
    function (test) {
      _.forOwn(globalNS, function (val, key) {
        test.strictEqual(NS[key], val);
      });

      test.done();
    }
  }
};
