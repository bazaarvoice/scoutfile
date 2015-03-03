var App = require('scoutfile/lib/browser/application');
var loader = require('scoutfile/lib/browser/loader');

var config = require('json!./config.json');

var MyApp = App('MyApp');

MyApp.config = config;
MyApp.loadScript = loader.loadScript;

loader.loadScript(config.appJS);
loader.loadStyleSheet(config.appCSS);
