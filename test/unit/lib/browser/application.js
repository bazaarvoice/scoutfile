'use strict';

var application = require('../../../../lib/browser/application');
var NS = require('../../../../lib/browser/namespace');

var config = { foo: 'bar' };
var appName = 'MyApp';

module.exports = {
  'lib/browser/application': {
    'exported function': {
      setUp: function (cb) {
        application(appName, config);
        cb();
      },

      tearDown: function (cb) {
        delete NS.MyApp;
        cb();
      },

      'creates Application instance': function (test) {
        test.ok(
          NS.MyApp,
          'application is not exposed on global.NS'
        );

        test.strictEqual(
          NS.MyApp.config,
          config,
          'config was not copied to application'
        );

        test.done();
      },

      'throws if app name matches existing property': function (test) {
        test.throws(function () {
          application(appName, config);
        }, Error);

        test.done();
      }
    }
  }
};
