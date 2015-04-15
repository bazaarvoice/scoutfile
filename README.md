[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-url]][daviddm-image]

# Scout

[Developer README](./CONTRIBUTING.md)

This repository provides a Node module that can be used to generate a "scout"
file for a client-side JavaScript application.

To use this project, it is assumed you already have an environment running
Node.

## Roadmap & Issues

See the [issues](//github.com/bazaarvoice/scoutfile/issues/) page for details on current development and future
plans. If there is scout file functionality that your project needs and is not
provided currently, please open an issue. Bug reports are also appreciated.

## Overview

A scout file is a small JavaScript file that serves as a loader for a client-
side JavaScript application. The scout file must always be less than 14k when
minified and gzipped. The scout file should have a short TTL, so changes will
take effect quickly; the resources it loads should have versioned URLs,
allowing them to have long TTLs.

[Read more about scout files and deploying JavaScript
applications](https://alexsexton.com/blog/2013/03/deploying-javascript-applications/).

The scout file's key responsibilities are:

- Load the core application resources
- Queue calls to render the core application until the core application is loaded
- Provide a way for the core application to access configuration information
- Provide a way for the core application to respond to any queued render calls
- Provide a way for the core application to redefine render behavior for future calls

This project uses [webpack](http://webpack.github.io/) to generate the built
scout file. It allows client-side JavaScript applications to specify the
functionality required in their scout file and provide any code that is unique
to their application that should be included in the scout file. It also
provides loaders for common tasks, such as using a JSON file as a source, or
inlining CSS. See below for more details about [loaders](#Loaders)

## Example

To try an example:

- Clone this repo:

```
git clone git@github.com:bazaarvoice/scoutfile.git
```

- Copy the files from the example directory of the repo:

```
cd scout
cp -r example ../scout-example
```

- Run the example:

```
cd ../scout-example
npm install
node generator.js
```

- Run the example Grunt task (make sure to `npm install -g grunt-cli` first if
  you don't already have the Grunt CLI installed):

```
grunt scoutfile
```

## Usage

You will need to `npm install` the scoutfile module and save it to your
project's dependencies:

```
npm install --save scoutfile
```

*Check the repo for the latest stable version, and modify the command above as required.*

You can now write your application's portion of the scout file. The example
below shows an application that includes modules provided by the scout project
(see [Including common functionality via modules](#including-common-
functionality-via-modules)), as well as a JSON resource (see [Including non-JS
resources](#including-non-js-resources)).

```js
var App = require('scoutfile/lib/browser/application');
var loader = require('scoutfile/lib/browser/loader');

var config = require('json!./config.json');

var MyApp = App('MyApp');

MyApp.config = config;
MyApp.loadScript = loader.loadScript;

loader.loadScript(config.appJS);
loader.loadStyleSheet(config.appCSS);
```

### Including common functionality via modules

This project provides modules for common tasks, such as reading and writing
cookies; loading JavaScript and CSS; and queueing JavaScript calls from the
host site until the core application resources arrive. [Learn more about the
modules provided by this project][modules].

### Including non-JS resources

The scout project provides access to several Webpack
[loaders](http://webpack.github.io/docs/using-loaders.html). These assist with
common tasks such as embedding a JSON file into the built scout file; loading
CSS into the built scout file; loading templates into the built scout file;
and other tasks. The following loaders are currently provided:

- [Handlebars](https://github.com/altano/handlebars-loader)
- [JSON](https://github.com/webpack/json-loader)
- [Raw](https://github.com/webpack/raw-loader)
- [Sass](https://github.com/jtangelder/sass-loader)
- [Yaml](https://github.com/okonet/yaml-loader)
- [CSS](https://github.com/webpack/css-loader)
- [File](https://github.com/webpack/file-loader)

If your project would benefit from a loader that is not listed here, please
fork this repository, create a branch, add the loader via `npm install
--save`, and then open a pull request explaining the need.

## Generating a scout file

### Via Node

The following code will log the generated scout file as a string:

```js
var scout = require('scoutfile');
scout.generate({
  appModules: [
    {
      name: 'MyApp',
      path: './app/scripts/scout/main.js'
    }
  ],

  // Specify `pretty` to get un-uglified output.
  pretty: true
}).then(function (scout) {
  console.log(scout);
});
```

### Via Grunt

This project also provides a Grunt task. To use it, first, load the Grunt task
in your Gruntfile.js:

```
grunt.loadNpmTasks('scoutfile');
```

This creates a `scoutfile` Grunt multitask. You can configure the task as
follows, providing the source modules and the destination for each multitask
configuration:

```js
grunt.initConfig({
  // ...
  scoutfile: {
    server : {
      src : [
        {
          name : 'MyApp',
          path : './app/scripts/scout/main.js'
        }
      ],
      dest : '.tmp/scripts/scout.js',

      // Specify `pretty` to get un-uglified code
      pretty : true
    },
    test : {
      src : [
        {
          name : 'MyApp',
          path : './app/scripts/scout/main.js'
        }
      ],
      dest : '.tmp/scripts/scout.js'
    }
  },
  // ...
});
```

To use the task, you can now run:

```bash
grunt scoutfile:server
```

### Controlling the Output

#### Specifying a "namespace"

By default, the scout will create `window.APP`, and use that as its namespace
if it needs to expose anything globally. This namespace can be accessed via
the `lib/browser/namespace` module. You can specify a different namespace by
setting the `namespace` property of the configuration that you pass to the
generator.

Specifying a namespace when using the scout module:

```js
var scout = require('scoutfile');
scout.generate({
  appModules: [
    {
      name: 'MyApp',
      path: './app/scripts/scout/main.js'
    }
  ],

  // Override the default `APP` namespace
  namespace: 'APPLICATION',

  // Specify `pretty` to get un-uglified output.
  pretty: true
}).then(function (scout) {
  console.log(scout);
});
```

Specifying a namespace for a Grunt task:

```
grunt.initConfig({
  // ...
  scoutfile: {
    server : {
      src : [
        {
          name : 'MyApp',
          path : './app/scripts/scout/main.js'
        }
      ],
      dest : '.tmp/scripts/scout.js',

      // Override the default `APP` namespace
      namespace: 'APPLICATION',

      // Specify `pretty` to get un-uglified code
      pretty : true
    }
  },
  // ...
});
```

#### Using build flags

You can also define flags that can be used to control build output; for
example, you could define a flag `DEBUG` that you could then use to only
execute certain code when the flag is true:

```
if (DEBUG) {
  doSomething();
}
else {
  doSomethingElse();
}
```

If a flag is false for a certain build configuration, and the `pretty` option
is not true, then Uglification will include dead code removal. So, for
example, if the `DEBUG` flag was set to false for a certain build
configuration, the above code would be reduced to:

```
doSomethingElse();
```

To specify flags, add a `flags` property to the config you provide to the
generator (or the config for each grunt task). The value of this property
should be an object, such as:

```
flags : {
  DEBUG : true
}
```

**If you are using a flag in your application's scout file code, note that
it's important to define it for all build configurations -- not just for the
build configuration for which it is true.**

Read more about flags and the Webpack `DefinePlugin`
[here](http://webpack.github.io/docs/list-of-plugins.html#defineplugin).

#### Including configuration information

To specify configuration data that should be available within the generated
scout file, add an `appConfig` property to the config you provide to the
generator (or the config for each grunt task).

```
appConfig : {
  reviews : true,
  comments : false,
  customerName : 'atticus'
}
```

See the [modules][modules] documentation for details on how to access this
data via the `appConfig` module.

[npm-url]: https://npmjs.org/package/scoutfile
[npm-image]: https://badge.fury.io/js/scoutfile.svg
[travis-url]: https://travis-ci.org/bazaarvoice/scoutfile
[travis-image]: https://travis-ci.org/bazaarvoice/scoutfile.svg?branch=master
[daviddm-url]: https://david-dm.org/bazaarvoice/scoutfile.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/bazaarvoice/scoutfile
[modules]: ./docs/modules.md
