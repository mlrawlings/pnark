# pnark: page speed reporter

## Basic usage with express & marko

Add the express middleware
```js
app.use(require('pnark/express').middleware({
  plugins: [require('pnark-marko'), require('pnark-tessa')]
}));
```

Visit your page in the browser, adding the `pnark=*` parameter
```
http://localhost:8080/path/to/page?pnark=*
```

Only show a specific plugin's information:
```
http://localhost:8080/path/to/page?pnark=marko
```

## Profiles

If there are a set of reporters or namespaces that you want to easily run together, you can create a profile:

```js
app.use(require('pnark/express').middleware({
  profiles: {
    'tesko':['marko', 'tessa'],
  },
  plugins: [require('pnark-marko'), require('pnark-tessa')],
}));
```

Only show a specific profile:
```
http://localhost:8080/path/to/page?pnark=tesko
```

## Writing plugins

Plugins allow you to define a group of reporters, namespaces, and profiles.

### Writing a reporter

A reporter is a function that takes three parameters:
- `report`: the pnark report
- `req`: the current http request
- `res`: the response for the current http request

```js
module.exports = function reporter(report, req, res) {
    report.section('This is My Title')
          .html('<strong>my content</strong>');

    report.end();
};
```
Learn more in the [reporters docs](docs/reporters.md).

### Exporting a Reporter

```js
module.exports = {
  reporters: {
    'my-reporter':function(report, req, res) { /* ... */ },
  }
}
```

Only show a specific reporter:
```
http://localhost:8080/path/to/page?pnark=my-reporter
```

### Exporting Namespaced Reporters

```js
module.exports = {
  reporters: {
    'marko':{
      'async-fragment':function(report, req, res) { /* ... */ },
      'another-reporter':function(report, req, res) { /* ... */ },
    },
  }
}
```

Only show a specific namespace:
```
http://localhost:8080/path/to/page?pnark=marko
```
Only show a specific reporter in a namespace:
```
http://localhost:8080/path/to/page?pnark=marko:async-fragment
```

