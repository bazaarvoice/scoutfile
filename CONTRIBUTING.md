# Contributing

## Maintainers

- @lawnsea
- @rmurphey

## Developing

To develop this code, you'll need Node and Grunt. Once you have Node
installed, you also have the Node package manager, npm. Now you can install
the dependencies for this repo:

Once you have Node installed, you also have the Node package manager, npm. Now
you can install the dependencies for this repo:

```bash
npm install
npm install -g grunt-cli
```

Tests are written in [nodeunit](https://github.com/caolan/nodeunit). There are
two sets of tests: a set that runs in Node, and a set that runs in the browser
or in [jsdom](https://github.com/tmpvar/jsdom). Tests run automatically on
`git push`.

## Running the tests

```bash
npm test
```

### Browser module tests in jsdom

```bash
grunt nodeunit-browser
```

As of this writing, there are a couple of browser module tests that cannot run
in jsdom because of bugs in jsdom. Running them in a real browser is the best
source of truth, but for the sake of speed, jsdom is used for automated
execution.

### Browser module tests in your browser

```bash
grunt serve-test
```

Tests can be viewed at [http://localhost:8080](http://localhost:8080).

### Node module tests

```bash
grunt nodeunit
```

## Use `npm link` for local development

Development of this project will often be associated with work in another
project. To facilitate this, npm provides [`npm
link`](https://docs.npmjs.com/cli/link), allowing the "host" project to
reference the scoutfile module on the local filesystem, rather than needing to
push changes to a repo every time something is changed. To use it, assuming
the root directory of the host project is a sibling of the root directory of
this repo, run the following in the host project:

```bash
npm link ../scoutfile
```
