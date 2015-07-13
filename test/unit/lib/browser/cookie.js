'use strict';

var cookie = require('../../../../lib/browser/cookie');
var global = require('../../../../lib/browser/global');

function deleteCookie (name) {
  global.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

module.exports = {
  'lib/browser/cookie': {
    create: {
      tearDown: function (cb) {
        deleteCookie('test%20create');
        cb();
      },

      'creates a cookie': function (test) {
        cookie.create('test create', 'cookie monster', 3);
        test.ok(global.document.cookie.match('test%20create=cookie%20monster'));
        test.done();
      }
    },

    read: {
      setUp: function (cb) {
        global.document.cookie = 'test%20read=Hello%20World';
        cb();
      },

      tearDown: function (cb) {
        deleteCookie('test%20read');
        cb();
      },

      'reads a cookie': function (test) {
        var c = cookie.read('test read');

        test.equal(c, 'Hello World');
        test.done();
      }
    },

    remove: {
      setUp: function (cb) {
        global.document.cookie = 'test%20delete=1';
        cb();
      },

      tearDown: function (cb) {
        deleteCookie('test%20delete');
        cb();
      },

      'deletes a cookie': function (test) {
        // JSDom doesn't do the right thing with expired cookies.
        // https://github.com/tmpvar/jsdom/issues/1027
        if (global.isJsdom) {
          return test.done();
        }

        cookie.remove('test delete');
        test.ok(!global.document.cookie.match('test%20delete'));
        test.done();
      }
    }
  }
};
