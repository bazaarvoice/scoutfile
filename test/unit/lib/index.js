'use strict';

var _ = require('lodash');
var fs = require('fs');
var scout = require('../../../lib/index');

module.exports = {
  'generate': {
    'arguments': {
      'options': {
        'is required': function (test) {
          test.throws(function () {
            scout.generate();
          }, /`options` is required/);
          test.done();
        },
        'options.src': {
          'source of specified modules is built into scout': function (test) {
            var expectedOne =
              fs.readFileSync('./test/fixtures/lib/index/app-one.js', {
              encoding: 'utf8'
            });
            var expectedTwo =
              fs.readFileSync('./test/fixtures/lib/index/app-two.js', {
              encoding: 'utf8'
            });

            scout.generate({
                appModules: [{
                  path: './test/fixtures/lib/index/app-one',
                  name: 'app-one'
                }, {
                  path: './test/fixtures/lib/index/app-two',
                  name: 'app-two'
                }],
                pretty: true
              }).
              then(function (src) {
                test.ok(
                  src.indexOf(expectedOne) > -1,
                  'scout should include app-one'
                );
                test.ok(
                  src.indexOf(expectedTwo) > -1,
                  'scout should include app-two'
                );
                test.done();
              }).
              catch(function (e) {
                console.log(e);
                test.done(e);
              });
          }
        },
        'options.flags': {
          'flags are used': function (test) {
            scout.generate({
              appModules: [{
                path: './test/fixtures/lib/index/app-flags',
                name: 'app-flags'
              }],
              flags: {
                BUILD_FLAG: true
              }
            }).
            then(function (src) {
              test.ok(
                src.indexOf('it works') > -1,
                'build flag should impact build');
              test.ok(
                src.indexOf('it does not work') === -1,
                'dead code should be removed');
              test.done();
            }, test.done);
          }
        },
        'options.appConfig': {
          'enables config module': function (test) {
            scout.generate({
              appModules: [{
                path: './test/fixtures/lib/index/app-config',
                name: 'app-config'
              }],
              appConfig: {
                myAppConfig: true
              }
            }).
            then(function (src) {
              test.ok(
                src.indexOf('myAppConfig') > -1,
                'app config should be included'
              );
              test.done();
            });
          }
        },
        'options.banner': {
          'as an object': {
            'includes banner as comment by default': function (test) {
              scout.generate({
                appModules: [{
                  path: './test/fixtures/lib/index/banner',
                  name: 'banner'
                }],
                banner: {
                  content: 'it works'
                }
              }).
              then(function (src) {
                test.ok(
                  src.indexOf('/*! it works */') > -1,
                  'banner should be included as a comment'
                );
                test.done();
              });
            },
            'includes raw banner if specified': function (test) {
              scout.generate({
                appModules: [{
                  path: './test/fixtures/lib/index/banner',
                  name: 'banner'
                }],
                banner: {
                  content: '"it works"',
                  options: {
                    raw: true
                  }
                }
              }).
              then(function (src) {
                test.ok(
                  src.match(/^"it works"/),
                  'banner should be included raw'
                );
                test.done();
              });
            }
          },
          'as an array': {
            'includes each banner as specified': function (test) {
              scout.generate({
                appModules: [{
                  path: './test/fixtures/lib/index/banner',
                  name: 'banner'
                }],
                banner: [
                  {
                    content: 'comment banner'
                  },
                  {
                    content: '"raw banner"',
                    options: {
                      raw: true
                    }
                  }
                ]
              }).
              then(function (src) {
                test.ok(
                  src.indexOf('/*! comment banner */') > -1,
                  'comment banner should be included as a comment'
                );

                test.ok(
                  src.match(/^"raw banner"/),
                  'raw banner should be included raw'
                );
                test.done();
              });
            }
          }
        }
      }
    },
    'returns a promise': {
      'that is a promise': function (test) {
        var promise = scout.generate({});

        test.
          ok(_.isFunction(promise.then), 'promise.then should be a function');
        test.done();
      },
      'that is resolved with the source on success': function (test) {
        scout.generate({}).
          then(function (src) {
            test.ok(
              _.isString(src),
              'success handler should be called with src'
            );
            test.done();
          });
      },
      'that is rejected with an `Error` on failure': function (test) {
        scout.generate({
            appModules: [{
              name: 'fake',
              path:'./no/such/module'
            }],
            pretty: true
          }).
          then(function () {
            test.ok(false, 'success handler should not be called');
          }).
          catch(function (err) {
            test.ok(
              err instanceof Error,
              'failure handler should be called with error'
            );
            test.done();
          });
      }
    },
    'accepts a node-style callback': {
      'that is called with the source on success': function (test) {
        scout.generate({}, function (err, src) {
            test.ok(_.isNull(err), '`err` should be null');
            test.ok(
              _.isString(src),
              'success handler should be called with src'
            );
            test.done();
          });
      },
      'that is called with an `Error` on failure': function (test) {
        scout.generate({
            appModules: [{
              name: 'fake',
              path:'./no/such/module'
            }],
            pretty: true
          }, function (err, src) {
            test.ok(
              err instanceof Error,
              'failure handler should be called with error'
            );
            test.ok(_.isUndefined(src), '`src` should be `undefined`');
            test.done();
          });
      }
    },
    '`lib/browser/kernel`': {
      'is built into the scout': function (test) {
        var expected = 'lib/browser/kernel';
        var expectedOne = 'test/fixtures/lib/index/app-one';

        scout.generate({
            appModules: [],
            pretty: true
          }).
          then(function (src) {
            test.ok(
              src.indexOf(expected) > -1,
              'scout should include `lib/browser/kernel`'
            );

            return scout.generate({
                appModules: [{
                  path: './test/fixtures/lib/index/app-one',
                  name: 'app-one'
                }],
                pretty: true
              });
          }).
          then(function (src) {
            test.ok(
              src.indexOf(expectedOne) > -1,
              'scout should include app-one'
            );
            test.ok(
              src.indexOf(expected) > -1,
              'scout should include `lib/browser/kernel`'
            );
            test.done();
          });
      },
      'catches exceptions thrown by application modules': function (test) {
        scout.generate({
            appModules: [{
              path: './test/fixtures/lib/index/app-that-throws',
              name: 'app-that-throws',
            }],
            pretty: true
          }).
          then(function (src) {
            test.doesNotThrow(function () {
                var consoleError = console.error;
                console.error = function () {};
                /* jshint evil: true */
                (new Function(src))();
                /* jshint evil: false */
                console.error = consoleError;
              }, 'exceptions should not bubble out of the scout');
            test.done();
          });
      }
    }
  }
};
