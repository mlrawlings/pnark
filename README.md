# pnark: page speed reporter

## Basic usage with express & marko

Add the express middleware
```js
app.use(require('pnark/express').middleware({
  plugins: {
    'async-fragment':require('pnark-marko-async'),
    'bundle-size':require('pnark-tessa-bundle'),
  }
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
http://localhost:8080/path/to/page?pnark=async-fragment
```

## Namespaces

```js
app.use(require('pnark/express').middleware({
  plugins: {
    'marko':{
      'async-fragment':require('pnark-marko-async'),
    },
    'tessa': {
      'bundle-size':require('pnark-tessa-bundle'),
    },
  }
}));
```

Only show a specific namespace:
```
http://localhost:8080/path/to/page?pnark=marko
```
Only show a specific plugin in a namespace:
```
http://localhost:8080/path/to/page?pnark=marko:async-fragment
```

## Profiles

```js
app.use(require('pnark/express').middleware({
  profiles: {
    'tesko':['marko', 'tessa'],
  },
  plugins: {
    'marko':{
      'async-fragment':require('pnark-marko-async'),
    },
    'tessa': {
      'bundle-size':require('pnark-tessa-bundle'),
    },
  },
}));
```

Only show a specific profile:
```
http://localhost:8080/path/to/page?pnark=tesko
```

## Bundles

A bundle is simply an object of `pnark` plugins and profiles that will be merged
into the existing settings. Example `tesko-bundle`:
```js
module.exports = {
  profiles: {
    'tesko':['marko', 'tessa'],
  },
  reporters: {
    'marko':{
      'async-fragment':require('pnark-marko-async'),
    },
    'tessa': {
      'bundle-size':require('pnark-tessa-bundle'),
    },
  },
};
```

Then specify the bundle when using the middleware:
```js
app.use(require('pnark/express').middleware({
  bundles:[require('tesko-bundle')],
}));
```

```js
app.use(require('pnark/express').middleware({
  logLevel: 'foo',
  profiles: {
    'all': 'marko,lasso'
  },
  plugins: [
    require('pnark-marko').init(),
    require('pnark-lasso'),
    {
      plugin: 'lasso-marko',
      config: {

      }
    }
  ]
}));
```
