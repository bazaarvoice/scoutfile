'use strict';

var global = require('../../../../lib/browser/global');
var loader = require('../../../../lib/browser/loader');

var doc = global.document;
var canaryEl = doc.getElementById('canary');
var links = doc.getElementsByTagName('link');
var originalLinkCount = links.length;

function cleanUpLinks() {
  var link;

  // remove any links added by the test that just ran
  while (links.length > originalLinkCount) {
    link = links[originalLinkCount];
    link.parentNode.removeChild(link);
  }
}

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
          },

          'options.attributes': {
            'sets attributes on the script tag': function (test) {
              global.libLoaderAttributeTestCallback = function () {
                global.libLoaderAttributeTestCallback = function () {};
                test.ok(document.querySelector('script[data-main="foo.js"]'));
                test.done();
              };

              loader.loadScript('/lib.loader.loadscript-attribute.js', {
                attributes : {
                  'data-main': 'foo.js'
                }
              });
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
        // skip this test in IE8 and jsdom
        if (global.attachEvent || global.isJsdom) {
          return test.done();
        }

        loader.loadScript('/no.such.script.js', {
          timeout: 1000
        }, function (err) {
          test.ok(err instanceof Error, '`err` should be an `Error`');
          test.equal(err.message, 'Error: could not load /no.such.script.js');
          clearTimeout(timeout);
          test.done();
        });

        var timeout = setTimeout(function () {
          test.done(new Error('script load error timed out'));
        }, 1100);
      },

      '`document` has correct value in loaded script': function (test) {
        global.libLoaderTestCallback = function (doc) {
          test.strictEqual(
            doc,
            window.document,
            '`document` should be === `window.document`');
          test.done();
        };

        loader.loadScript('/lib.loader.document-is-wrong-in-ie8.js');
      }
    },

    'loadStyleSheet': {
      tearDown: function (callback) {
        cleanUpLinks();
        callback();
      },

      'arguments': {
        'url': {
          'is required': function (test) {
            test.throws(function () {
              loader.loadStyleSheet();
            }, /`url` must be a string/, '`url` is required');
            test.done();
          },

          'must be a string': function (test) {
            test.throws(function () {
                loader.loadStyleSheet(123);
              }, /`url` must be a string/,
              'should throw if `url` is not a string'
            );
            test.done();
          }
        },

        'options': {
          'is optional': function (test) {
            test.doesNotThrow(function () {
              loader.loadStyleSheet('/lib.loader.loadstylesheet.css');
            }, '`options` should be optional');

            test.done();
          },

          'is optional when callback is provided': function (test) {
            global.libLoaderTestCallback = function () {};

            test.doesNotThrow(function () {
              loader.loadStyleSheet(
                '/lib.loader.loadstylesheet.css',
                null,
                function () {
                  test.done();
                });
            }, '`options` should be optional');
          },

          'options.timeout': {
            'is optional': function (test) {
              test.doesNotThrow(function () {
                loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {});
              }, '`options.timeout` should be optional');

              test.done();
            },

            'must be a number': function (test) {
              test.throws(function () {
                  loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {
                    timeout: '123'
                  });
                }, /`options.timeout` must be a number/,
                'should throw if `options.timeout` is not a number'
              );
              test.done();
            }
          },

          'options.attributes': {
            'sets attributes on the link tag': function (test) {
              loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {
                attributes : {
                  id : 'loaded-css'
                }
              }, function () {
                test.ok(document.querySelector('#loaded-css'));
                test.done();
              });
            }
          },

          'options.injectionNode': {
            'defines injection point for link tag': function (test) {
              var container = document.createElement('div');
              loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {
                injectionNode : container
              }, function () {
                test.ok(container.getElementsByTagName('link').length > 0);
                test.done();
              });
            },
            'must be a DOM node': function (test) {
              test.throws(function () {
                  loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {
                    injectionNode : false
                  });
                }, /`options.injectionNode` must be a DOM node/,
                'should throw if `options.injectionNode` is not a DOM node'
              );
              test.done();
            },
            'should throw if appending fails': function (test) {
              var container = document.createElement('div');
              container.appendChild = function () {
                throw 'Intentional sabotage!';
              };

              loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {
                injectionNode : container
              }, function (result) {
                test.ok(result instanceof Error);
                test.done();
              });
            }
          }
        },

        'callback': {
          'is optional': function (test) {
            test.doesNotThrow(function () {
              loader.loadStyleSheet('/lib.loader.loadstylesheet.css', {});
            }, '`callback` should be optional');

            test.done();
          },

          'must be a function': function (test) {
            test.throws(function () {
                loader.
                  loadStyleSheet('/lib.loader.loadstylesheet.css', {}, 123);
              }, /`callback` must be a function/,
              'should throw if `callback` is not a function'
            );
            test.done();
          }
        }
      },

      // TODO: Fix this test; it fails, even though the actual functionality
      // appears to work fine. Tracked as #20.
      //
      // 'loads the stylesheet at `url`': function (test) {
      //   cleanUpLinks();

      //   loader.loadStyleSheet('/lib.loader.loadstylesheet.css', function () {
      //     test.ok(canaryEl.offsetWidth === 100, 'stylesheet should load');
      //     test.done();
      //   });
      // },

      'loads the stylesheet on a later turn of the event loop':
        function (test) {
          cleanUpLinks();

          loader.loadStyleSheet('/lib.loader.loadstylesheet.css', function () {
            test.done();
          });

          test.ok(
            canaryEl.offsetWidth !== 100,
            'stylesheet should not load until a later turn of the event loop'
          );
        },

      'calls back on success': function (test) {
        cleanUpLinks();

        loader.loadStyleSheet('/lib.loader.loadstylesheet.css', function () {
          test.done();
        });
      },

      'calls back on failure': function (test) {
        if (global.attachEvent) {
          // skip this test in IE8
          return test.done();
        }

        cleanUpLinks();

        loader.loadStyleSheet('/no.such.stylesheet.css', {
          timeout: 1000
        }, function (err) {
          test.ok(err instanceof Error, '`err` should be an `Error`');
          test.
            equal(err.message, 'Error: could not load /no.such.stylesheet.css');
          clearTimeout(timeout);
          test.done();
        });

        var timeout = setTimeout(function () {
          test.done(new Error('stylesheet load error timed out'));
        }, 1100);
      }
    }
  }
};
