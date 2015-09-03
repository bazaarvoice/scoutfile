# Modules

This document explains the modules that are available to use in your generated
scout file. Modules are located in the lib/browser directory, and can be
included in your application's portion of the scout file as follows:

```js
// require a module provided by the scout repo
var ie = require('scoutfile/lib/browser/ie');

// use that module
if (ie && ie < 8) {
  // get a new job
}
```

With the exception of the `namespace` module, only modules that you chose to
`require` in your application will be included in your generated scout file.

## application

The application module provides a function that creates an application
instance using a name you provide. An application instance provides methods to
queue your user's calls until the actual code to support those calls is
present. For documentation of the application class, see:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/application

For example, your user may expect to be able to ask your application to render
immediately after your scout file is loaded, even though the code to perform
the rendering has not yet loaded.

Once you create an application instance, it is available via its application
name as a property in the scout file's namespace. (By default, the scout
file's namespace is `window.APP`, but this can be changed in your build
configuration). So, for example, if you create an application with a name of
"Spotlights," then the application instance will be available at
`window.APP.Spotlights`.

The application module is typically used in conjunction with the
[loader](#loader) module and some configuration data:

```js
// require modules provided by the scout repo
var app = require('scoutfile/lib/browser/application');
var loader = require('scoutfile/lib/browser/loader');
var config = require('json!config.json');

// creates an application object at window.APP.MyApp
var myApp = app('MyApp');

// store configuration data so other code can access it
myApp.config = config;

// load the core application, which will define
// the APP.MyApp.onLoad method
loader.loadScript(config.appJS).then(APP.MyApp.onLoad);
```

## appConfig

The appConfig module provides a way to include in-memory configuration
information in your scout file. For example, you may build different scout
files to support different products or customers, where product- or
customer-specific configuration changes even though the fundamental contents
of the scout file do not.

In this case, you can provide this configuration information at build time
using the `appConfig` option:

```js
scout.generate({
  appModules: [
    // ...
  ],
  appConfig: {
    reviews: true,
    comments: false,
    customerName: 'atticus'
  }
});
```

You can then access the provided configuration using the `appConfig` module:

```js
var appConfig = require('scoutfile/lib/browser/appConfig');

if (appConfig.reviews) {
  // ...
}
```

## cookie

The cookie module provides methods for interacting with browser cookies. See:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/cookie

## evented

The evented module provides a function that can be called on a constructor in
order to make instances act as event emitters. See:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/evented

## global

The global module provides reliable access to the `window` object. See:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/global

## ie

The ie module provides the version of IE in which the scout is running. See:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/ie

## loader

The loader module provides the following methods to load scripts and
stylesheets. See:

https://github.com/bazaarvoice/bv-ui-core/tree/master/lib/loader

## namespace

The namespace module provides access to the "namespace" for the scout file. By
default, this will be `window.APP`, but it can be changed using the
`namespace` option in the configuration you provide to the scout file
generator. See the [README](../README.md#specifying-a-namespace) for details.

Generally, you should not create new properties on the namespace object
directly; the [application module](#application) creates a property on the
object for each registered application, and you should create application-
specific properties there instead.

## util

The util module provides a very limited subset of
[lodash](https://lodash.com/), which includes *only* the following methods:

- `each`
- `forEach`
- `indexOf`
- `isArray`
- `isFunction`

Typical usage:

```js
var _ = require('scoutfile/lib/browser/util')._;

_.each([ 1, 2, 3 ], function (item, index, arr) {
  console.log(item, index, arr);
});
```
