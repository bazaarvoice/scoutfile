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
    },

    'instance': {
      'render method': {
        setUp: function (cb) {
          application(appName, config);
          cb();
        },

        tearDown: function (cb) {
          delete NS.MyApp;
          cb();
        },

        'queues calls to render': function (test) {
          test.equal(NS.MyApp._renderQueue.length, 0,
            'there should be no items in the render queue');

          NS.MyApp.render(config);

          test.equal(NS.MyApp._renderQueue.length, 1,
            'there should be one item in the render queue');

          test.done();
        },

        'original render method always gets replaced': function(test) {
          var myApp = NS.MyApp;
          myApp.originalRender = myApp.render;

          var count = 0;
          var spy = function() {
            count++;
          };

          myApp.processQueue(spy);

          // even calling myApp's original definition of render
          // should call the new function
          myApp.originalRender();
          myApp.originalRender();
          myApp.originalRender();

          test.equal(3, count);
          test.done();
        }

      },

      'processQueue method': {
        setUp: function (cb) {
          application(appName, config);
          cb();
        },

        tearDown: function (cb) {
          delete NS.MyApp;
          cb();
        },

        'processes the queue async': function (test) {
          var flag = 0;

          var fn = function () {
            flag++;
          };

          NS.MyApp.render(config);
          NS.MyApp.render(config);

          NS.MyApp.processQueue(fn);

          test.equal(flag, 0,
            'queue should be processed async');

          setTimeout(function () {
            test.equal(flag, 2,
              'queue handler should have been called one time');

            test.done();
          }, 100);
        },

        'redefines the render method': function (test) {
          var fn = function () {
            return 'overridden';
          };

          NS.MyApp.processQueue(fn);

          setTimeout(function () {
            test.equal(NS.MyApp.render(), 'overridden',
              'queue handler should have replaced old render method');

            test.done();
          }, 100);
        },

        'throws if handler is not provided': function (test) {
          test.throws(function () {
            NS.MyApp.processQueue();
          }, 'processQueue should throw without a handler');

          test.done();
        }
      },
      'configure method': {
        setUp: function (cb) {
          application(appName, config);
          cb();
        },

        tearDown: function (cb) {
          delete NS.MyApp;
          cb();
        },

        'queues calls to configure': function (test) {
          test.equal(NS.MyApp._configQueue.length, 0,
            'there should be no items in the config queue');

          NS.MyApp.configure(config);

          test.equal(NS.MyApp._configQueue.length, 1,
            'there should be one item in the config queue');

          test.done();
        },

        'original configure method always gets replaced': function(test) {
          var myApp = NS.MyApp;
          myApp.originalConfigure = myApp.configure;

          var count = 0;
          var spy = function() {
            count++;
          };

          myApp.processConfig(spy);

          // even calling myApp's original definition of configure
          // should call the new function
          myApp.originalConfigure();
          myApp.originalConfigure();
          myApp.originalConfigure();

          test.equal(3, count);
          test.done();
        }
      },

      'processConfig method': {
        setUp: function (cb) {
          application(appName, config);
          cb();
        },

        tearDown: function (cb) {
          delete NS.MyApp;
          cb();
        },

        'processes the queue': function (test) {
          var flag = 0;

          var fn = function () {
            flag++;
          };

          NS.MyApp.configure(config);
          NS.MyApp.configure(config);

          NS.MyApp.processConfig(fn);

          test.equal(flag, 2,
            'queue handler should have been called one time');

          test.done();
        },

        'redefines the configure method': function (test) {
          var fn = function () {
            return 'overridden';
          };

          NS.MyApp.processConfig(fn);

          test.equal(NS.MyApp.configure(), 'overridden',
            'queue handler should have replaced old configure method');

          test.done();
        },

        'throws if handler is not provided': function (test) {
          test.throws(function () {
            NS.MyApp.processConfig();
          }, 'processConfig should throw without a handler');

          test.done();
        }
      }
    }
  }
};
