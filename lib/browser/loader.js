/**
 * Load JavaScript and CSS at runtime
 *
 * This module is derived from yepnope.js 2.0.0: 
 * Copyright (c) 2014, Alex Sexton
 * Copyright (c) 2014, Ralph Holzmann
 * All rights reserved.
 * New BSD license:
 * https://github.com/SlexAxton/yepnope.js/blob/master/LICENSE.md
 *
 * @module
 */
'use strict';

var doc = require('./global').document;

var DEFAULT_TIMEOUT = 1000;

function getFirstScript() {
  return doc.getElementsByTagName('script')[0];
}

function isFileReady(readyState) {
  // the file is ready if there is no readyState, or if it has reached a
  // terminal state.
  return !readyState ||
    readyState === 'loaded' ||
    readyState === 'complete' ||
    readyState === 'uninitialized';
}

var nextId = 0;
function getId() {
  return 'bvScoutLoaderScript' + nextId++;
}

function validateArguments(url, options, callback) {
  if (!url || typeof url !== 'string') {
    throw new Error('`url` must be a string');
  }

  if (typeof options.timeout !== 'number') {
    throw new Error('`options.timeout` must be a number');
  }

  if (callback && typeof callback !== 'function') {
    throw new Error('`callback` must be a function');
  }
}

// In older versions of Internet Explorer, the script is not guaranteed to
// execute before its callback.
// See http://bit.ly/1CTzYCjl
var isOldIE = !!doc.attachEvent &&
  !(window.opera && window.opera.toString() === '[object Opera]');

module.exports = {
  /**
   * Load a script from a URL
   *
   * The script is loaded on a later turn of the event loop. If a callback is
   * provided, it will be invoked on success in all supported browsers. The
   * callback will execute after the script.
   *
   * In modern IE and other browsers, the callback will be invoked with an error
   * on failure as well. A timeout in milliseconds may be provided as
   * `options.timeout`. If this timeout expires before loading fails or
   * succeeds, the callback will be invoked with an error.
   *
   * @param {string} url - URL of the script
   * @param {object} [options]
   * @param {number} options.timeout - timeout in milliseconds
   * @param {function} [callback] - node-style callback
   */
  loadScript: function (url, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    options = options || {};
    options.timeout = options.timeout || DEFAULT_TIMEOUT;

    validateArguments(url, options, callback);

    var script = doc.createElement('script');
    var done = false;

    if (isOldIE) {
      // set up workaround to enforce script and callback ordering in old IE
      script.event = 'onclick';
      script.id = script.htmlFor = getId();
    }

    function cleanUp(err) {
      done = true;
      clearTimeout(timeoutHandle);
      script.onload = script.onreadystatechange = script.onerror = null;
      script.parentNode.removeChild(script);

      if (callback) {
        try {
          callback(err);
        } catch (e) {
          // FIXME: report this error once analytics support is available
        }
      }
    }

    script.onreadystatechange = script.onload = function () {
      if (done || !isFileReady(script.readyState)) {
        return;
      }

      if (isOldIE) {
        try {
          // ensure that the script is executed before the callback in old IE
          script.onclick();
        } catch (e) {}
      }

      cleanUp();
    };

    script.onerror = function () {
      if (done) {
        return;
      }

      cleanUp(new Error('Error: could not load ' + url));
    };

    var timeoutHandle = setTimeout(script.onerror, options.timeout);

    // If a script is cached, IE may execute it immediately, which breaks
    // JavaScript's run-to-completion semantics. So, don't try to load the
    // script until a later turn of the event loop.
    // 
    // See http://www.guypo.com/ies-premature-execution-problem/
    setTimeout(function () {
      script.src = url;

      var firstScript = getFirstScript();
      firstScript.parentNode.insertBefore(script, firstScript);
    }, 0);
  },

  /**
   * Load a stylesheet from a URL
   *
   * The stylesheet is loaded on a later turn of the event loop. If a callback
   * is provided, it will be invoked on success in all supported browsers.
   *
   * In modern IE and other browsers, the callback will be invoked with an error
   * on failure as well. A timeout in milliseconds may be provided as
   * `options.timeout`. If this timeout expires before loading fails or
   * succeeds, the callback will be invoked with an error.
   *
   * @param {string} url - URL of the stylesheet
   * @param {object} [options]
   * @param {number} options.timeout - timeout in milliseconds
   * @param {function} [callback] - node-style callback
   */
  loadStyleSheet: function (url, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    options = options || {};
    options.timeout = options.timeout || DEFAULT_TIMEOUT;

    validateArguments(url, options, callback);

    var link = doc.createElement('link');
    var done = false;

    function cleanUp(err) {
      done = true;
      clearTimeout(timeoutHandle);
      link.onload = link.onreadystatechange = link.onerror = null;

      if (callback) {
        try {
          callback(err);
        } catch (e) {
          // FIXME: report this error once analytics support is available
        }
      }
    }

    link.onreadystatechange = link.onload = function () {
      if (done || !isFileReady(link.readyState)) {
        return;
      }

      cleanUp();
    };

    link.onerror = function () {
      if (done) {
        return;
      }

      cleanUp(new Error('Error: could not load ' + url));
    };

    var timeoutHandle = setTimeout(link.onerror, options.timeout);

    // Inject the stylesheet on a later turn of the event loop
    setTimeout(function () {
      // technique to force non-blocking loading from:
      // https://github.com/filamentgroup/loadCSS/blob/master/loadCSS.js#L20
      link.media = 'only x';

      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;

      // on next tick, set `media` back
      setTimeout(function() {
        link.media = 'all';
      }, 0);

      getFirstScript().parentNode.appendChild(link);
    }, 0);
  }
};
