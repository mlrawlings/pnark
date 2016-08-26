# pnark: page speed reporter

[![Build Status](https://travis-ci.org/mlrawlings/pnark.svg?branch=master)](https://travis-ci.org/mlrawlings/pnark)
[![Coverage Status](https://coveralls.io/repos/github/mlrawlings/pnark/badge.svg?branch=master)](https://coveralls.io/github/mlrawlings/pnark?branch=master)

pnark (pronounced [***närk***](https://ssl.gstatic.com/dictionary/static/sounds/de/0/nark.mp3) - the `p` is silent) is a module that allows you to get insight into what's happening on your server during the lifecycle of a request.

## Basic usage with express

**1.** Add the express middleware and some plugins:
```js
app.use(require('pnark/express').middleware({
  plugins: [require('pnark-http'), require('pnark-fs')]
}));
```

**2.** Visit your page in the browser and click the icon in the bottom right of your screen to view the report
![](https://raw.githubusercontent.com/mlrawlings/pnark/master/screenshots/how-to-open.png)

**3.** Read the report, become a better developer
![](https://raw.githubusercontent.com/mlrawlings/pnark/master/screenshots/report-preview.png)

## Available plugins

- [pnark-http](https://www.npmjs.com/package/pnark-http)
- [pnark-log](https://www.npmjs.com/package/pnark-log)
- [pnark-fs](https://www.npmjs.com/package/pnark-fs)

## Writing plugins

*Coming Soon*
