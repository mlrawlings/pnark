# pnark: page speed reporter

## Basic usage with express & marko

Add the express middleware
```js
app.use(require('pnark/express').middleware({
  plugins: [require('pnark-marko'), require('pnark-tessa')]
}));
```

Include the report tag
```html
<html>
<body>
    <!-- page content... -->
    <pnark-report />
</body>
</html>
```

Visit your page in the browser, adding the `pnark` parameter
```
http://localhost:8080/path/to/page?pnark
```

Only show a specific plugin's information:
```
http://localhost:8080/path/to/page?pnark=marko
```

## Writing plugins

Plugins allow you to define reporters, namespaces, and profiles.

### Exporting Namespaces & Reporters

```js
module.exports = {
  reporters: {
    'marko':{
      'async-fragment':function(...) { ... },
      'another-reporter':function(...) { ... },
    },
  }
}
```

```js
app.use(require('pnark/express').middleware({
  plugins:[require('pnark-marko')]
});
```

Only show a specific namespace:
```
http://localhost:8080/path/to/page?pnark=marko
```
Only show a specific reporter in a namespace:
```
http://localhost:8080/path/to/page?pnark=marko:async-fragment
```

### Profiles

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
