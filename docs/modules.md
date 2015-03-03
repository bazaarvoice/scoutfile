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
present.

For example, your user may expect to be able to ask your application to render
immediately after your scout file is loaded, even though the code to perform
the rendering has not yet loaded.

Once you create an application instance, it is available via its application
name as a property in the scout file's namespace. (By default, the scout
file's namespace is `window.APP`, but this can be changed in your build
configuration.) So, for example, if you create an application with a name of
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

An application instance provides the following methods:

- `render(config)`: A method intended for your users to call any time after
  the scout file is loaded, passing in configuration information related to a
  request to render your application.

```js
APP.MyApp.render({ productId : 1 });
```

- `processQueue(fn)`: A method that your core application code can call in
  order to access calls to `render` that have occurred; the provided function
  will be used to handle those calls, and will then replace the original
  definition of the `render` method. Queued items are processed on the next
  tick.
- `configure(config)`: A method intended for your users to call any time after
  the scout file is loaded, passing in general configuration information not
  necessarily related to rendering.
- `processConfig(fn)`: A method that your core application code can call in
  order to access calls to `configure` that have occurred; the provided
  function will be used to handle those calls, and will then replace the
  original definition of the `configure` method. Queued items are processed
  synchronously, as they are not expected to have any DOM implications.

## cookie

The cookie module provides methods for interacting with browser cookies.

```js
var cookie = require('scoutfile/lib/browser/cookie');

cookie.write('RememberMe', '1', 365);
console.log(cookie.read('RememberMe')); // '1'
cookie.remove('RememberMe');
```

The following methods are provided:

- `read(name)`: Read the cookie with the given name.
- `create(name, value, [days, domain, secure])`: Write a cookie with the given
  name and value. Set the expiration in days using the `days` argument; set
  the domain using the `domain` argument; indicate that the cookie is secure
  by passing `true` as the `secure` argument. Note that if one optional
  argument is provided, all previous arguments must be provided as well.
- `remove(name)`: Delete the cookie with the given name.

## evented

Based on [asEvented](https://github.com/mkuklis/asEvented), the evented module
provides a function that can be called on a constructor in order to make
instances act as event emitters.

```js
var evented = require('scoutfile/lib/browser/evented');

function Model(config) {
  this.config = config;
};

evented.call(Model.prototype);
```

An event emitter provides the following methods:

- `on(event, fn)`
- `off(event, fn)`
- `one(event, fn)`
- `trigger(event, *data)`

## global

The global module provides reliable access to the `window` object.

```js
// require modules provided by the scout repo
var global = require('scoutfile/lib/browser/global');
var doc = global.document;

// ...
```

## ie

The ie module provides the version of IE in which the scout is running, if the
browser is IE and the version is less than or equal to 9. In other cases, the
value provided by the module is false.

```js
// require modules provided by the scout repo
var ie = require('scoutfile/lib/browser/ie');

if (!ie) {
  // thank goodness
}
```

## loader

The loader module provides the following methods:

- `loadScript(url, [options], [callback])`: Loads the script at the provided
  URL in a non-blocking manner, and executes a Node-style callback (if
  provided) when the script is loaded or fails to load. Also returns a promise
  that will be resolved if the script loads, and rejected if it does not. A
  `timeout` value in milliseconds can be provided via the `options` argument.
- `loadStyleSheet(url, [options], [callback])`: Loads the CSS at the provided
  URL in a non-blocking manner, and executes a Node-style callback (if
  provided) when the CSS is loaded or fails to load. Also returns a promise
  that will be resolved if the CSS loads, and rejected if it does not. A
  `timeout` value in milliseconds can be provided via the `options` argument.

```js
var loader = require('scoutfile/lib/browser/loader');

var promise = loader.loadScript('/scripts/main.js', function (err, cb) {
  console.log('it worked');
});

promise.then(function () {
  console.log('it really worked');
});
```

Note: Failure to load is *not* reliably detected in older versions of IE. For
both `loadScript` and `loadStyleSheet`, the callback will not be executed on
failure in old IE, and the returned promise will not be rejected on failure in
old IE.

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
