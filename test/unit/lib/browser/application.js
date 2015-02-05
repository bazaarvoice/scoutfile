'use strict';

var application = require('../../../../lib/browser/application');
var BV = require('../../../../lib/browser/bv');
console.log(BV)

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
        delete BV.MyApp;
        cb();
      },

      'creates Application instance': function (test) {
        test.ok(
          BV.MyApp,
          'application is not exposed on global.BV'
        );

        test.strictEqual(
          BV.MyApp.config,
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
          delete BV.MyApp;
          cb();
        },

        'queues calls to render': function (test) {
          test.equal(BV.MyApp._renderQueue.length, 0,
            'there should be no items in the render queue');

          BV.MyApp.render(config);

          test.equal(BV.MyApp._renderQueue.length, 1,
            'there should be one item in the render queue');

          test.done();
        },

        'original render method always gets replaced': function(test) {
          var myApp = BV.MyApp;
          myApp.originalRender = myApp.render;

          var count = 0;
          var spy = function() {
            count++;
          };

          myApp.processQueue(spy);

          // even calling myApp's original definition of "render()" should call the new fn
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
          delete BV.MyApp;
          cb();
        },

        'processes the queue': function (test) {
          var flag = 0;

          var fn = function () {
            console.log('called')
            flag++;
          };

          BV.MyApp.render(config);
          BV.MyApp.render(config);

          BV.MyApp.processQueue(fn);

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

          BV.MyApp.processQueue(fn);

          setTimeout(function () {
            test.equal(BV.MyApp.render(), 'overridden',
              'queue handler should have replaced old render method');

            test.done();
          }, 100);
        },

        'throws if handler is not provided': function (test) {
          test.throws(function () {
            BV.MyApp.processQueue();
          }, 'processQueue should throw without a handler');

          test.done();
        }
      }
    }
  }
};