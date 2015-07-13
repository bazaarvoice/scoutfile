/* eslint no-sequences: 0 */
/**
 * @fileOverview A short snippet for detecting versions of IE in JavaScript
 * without resorting to user-agent sniffing. Will only work for IE >=5 and <=9
 * since IE10 dropped support for conditional comments. When ie is undefined
 * it means it's either IE10+ or not an IE browser.
 */
'use strict';

var doc = require('./global').document;

module.exports = (function () {
  var ie = (function (v, div, undef) {
    var all = div.getElementsByTagName('i');

    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]
    ) {
      // Empty.
    }
    return v > 4 ? v : undef;
  })(3, doc.createElement('div'));

  return ie;
})();
