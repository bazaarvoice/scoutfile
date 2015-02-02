'use strict';

var global = require('../../../../lib/browser/global');
var loader = require('../../../../lib/browser/loader');

module.exports = {
  'lib/loader': {
    'loadScript': {
      'arguments': {
        'url': {
          'is required': function (test) {
            test.throws(function () {
              loader.loadScript();
            }, /`url` must be a string/, '`url` is required');
            test.done();
          },

          'must be a string': function (test) {
            test.throws(function () {
                loader.loadScript(123);
              }, /`url` must be a string/,
              'should throw if `url` is not a string'
            );
            test.done();
          }
        },

        'options': {
          'is optional': function (test) {
            global.libLoaderTestCallback = function () {
              global.libLoaderTestCallback = function () {};
              test.done();
            };

            test.doesNotThrow(function () {
              loader.loadScript('/lib.loader.loadscript.js');
            }, '`options` should be optional');
          },

          'is optional when callback is provided': function (test) {
            global.libLoaderTestCallback = function () {};

            test.doesNotThrow(function () {
              loader.loadScript('/lib.loader.loadscript.js', null, function () {
                test.done();
              });
            }, '`options` should be optional');
          },

          'options.timeout': {
            'is optional': function (test) {
              global.libLoaderTestCallback = function () {
                global.libLoaderTestCallback = function () {};
                test.done();
              };
              test.doesNotThrow(function () {
                loader.loadScript('/lib.loader.loadscript.js', {});
              }, '`options.timeout` should be optional');
            },

            'must be a number': function (test) {
              test.throws(function () {
                  loader.loadScript('/lib.loader.loadscript.js', {
                    timeout: '123'
                  });
                }, /`options.timeout` must be a number/,
                'should throw if `options.timeout` is not a number'
              );
              test.done();
            }
          }
        },

        'callback': {
          'is optional': function (test) {
            global.libLoaderTestCallback = function () {
              test.done();
            };
            test.doesNotThrow(function () {
              loader.loadScript('/lib.loader.loadscript.js', {});
            }, '`callback` should be optional');
          },

          'must be a function': function (test) {
            test.throws(function () {
                loader.loadScript('/lib.loader.loadscript.js', {}, 123);
              }, /`callback` must be a function/,
              'should throw if `callback` is not a function'
            );
            test.done();
          }
        }
      },

      'loads the script at `url`': function (test) {
        global.libLoaderTestCallback = function () {
          global.libLoaderTestCallback = function () {};
          clearTimeout(timeout);
          test.done();
        };

        loader.loadScript('/lib.loader.loadscript.js');
        var timeout = setTimeout(function () {
          global.libLoaderTestCallback = function () {};
          test.done(new Error('script load timed out'));
        }, 1000);
      },

      'loads the script on a later turn of the event loop': function (test) {
        var later = false;
        setTimeout(function () {
          later = true;
        }, 0);

        global.libLoaderTestCallback = function () {
          test.ok(
            later,
            'the script should not execute until a later turn of the event loop'
          );
          
          global.libLoaderTestCallback = function () {};
          clearTimeout(timeout);
          test.done();
        };

        loader.loadScript('/lib.loader.loadscript.js?');
        var timeout = setTimeout(function () {
          global.libLoaderTestCallback = function () {};
          test.done(new Error('script load timed out'));
        }, 1000);

      },

      'calls back on success': function (test) {
        global.libLoaderTestCallback = function () {};

        loader.loadScript('/lib.loader.loadscript.js', function () {
          clearTimeout(timeout);
          test.done();
        });
        var timeout = setTimeout(function () {
          test.done(new Error('script load timed out'));
        }, 1000);
      },

      'executes callback after the script': function (test) {
        var scriptExecuted = false;

        global.libLoaderTestCallback = function () {
          scriptExecuted = true;
        };

        loader.loadScript('/lib.loader.loadscript.js', function () {
          test.ok(scriptExecuted, 'the script should run before the callback');
          clearTimeout(timeout);
          test.done();
        });
        var timeout = setTimeout(function () {
          test.done(new Error('script load timed out'));
        }, 1000);
      },

      'calls back on failure': function (test) {
        if (global.attachEvent) {
          // skip this test in IE8
          return test.done();
        }

        loader.loadScript('/no.such.script.js', {
          timeout: 100
        }, function (err) {
          test.ok(err instanceof Error, '`err` should be an `Error`');
          test.equal(err.message, 'Error: could not load /no.such.script.js');
          clearTimeout(timeout);
          test.done();
        });

        var timeout = setTimeout(function () {
          test.done(new Error('script load error timed out'));
        }, 200);
      }
    }
  }
};
