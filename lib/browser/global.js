'use strict';

// Functions created via the Function constructor in strict mode are sloppy
// unless the function body contains a strict mode pragma. This is a reliable
// way to obtain a reference to the global object in any ES3+ environment.
// see http://stackoverflow.com/a/3277192/46867

/* jshint evil: true */
module.exports = (new Function('return this;'))();
/* jshint evil: false */
