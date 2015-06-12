'use strict';

var cookie = require('../../../../lib/browser/cookie');
var global = require('../../../../lib/browser/global');

function deleteCookie (name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

module.exports = {
  'lib/browser/cookie': {
    'create': {
      tearDown: function (cb) {
        deleteCookie('testCreate');
        cb();
      },

      'creates a cookie': function (test) {
        cookie.create('test create', 'cookie monster', 3);
        test.ok(global.document.cookie.match('test%20create=cookie%20monster'));
        test.done();
      }
    },

    'read': {
      setUp: function (cb) {
        document.cookie = 'testRead=Hello%20World';
        cb();
      },

      tearDown: function (cb) {
        deleteCookie('testRead');
        cb();
      },

      'reads a cookie': function (test) {
        var c = cookie.read('testRead');
        test.equal(c, 'Hello World');
        test.done();
      }
    },

    'remove': {
      setUp: function (cb) {
        document.cookie = 'testDelete=1';
        cb();
      },

      tearDown: function (cb) {
        deleteCookie('testDelete');
        cb();
      },

      'deletes a cookie': function (test) {
        // JSDom doesn't do the right thing with expired cookies.
        // https://github.com/tmpvar/jsdom/issues/1027
        if (global.isJsdom) {
          return test.done();
        }

        cookie.remove('testDelete');
        test.ok(!global.document.cookie.match('testDelete'));
        test.done();
      }
    }
  }
};
