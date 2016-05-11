'use strict';

var chai = require('chai');
chai.config.includeStack = true;
var path = require('path');
var autotest = require('./autotest');
var express = require('express');
var request = require('request');
var fs = require('fs');
var jsdom = require("jsdom").jsdom;

var middleware = require('../express');
var utils = require('../src/utils');

describe('express', function() {
    var autoTestDir = path.join(__dirname, 'autotests/express');

    autotest.scanDir(
        autoTestDir,
        function run(dir, helpers, done) {
            var mainPath = path.join(dir, 'test.js');
            var main = fs.existsSync(mainPath) ? require(mainPath) : {};

            if(main.before) main.before();

            if (main.checkError) {
                var e;

                try {
                    main.initApp(express(), middleware);
                } catch(_e) {
                    e = _e;
                }

                if (!e) {
                    throw new Error('Error expected');
                }

                main.checkError(e);
                return done();
            } else {
                var app = express();
                var requestPath = main.requestPath || '/';

                main.initApp(app, middleware);

                var server = app.listen(0, function(err) {
                    if(err) {
                        return done(err);
                    }

                    var port = server.address().port;
                    var address = `http://localhost:${port}${requestPath}`;
                    var _generateId = utils.generateId;

                    utils.generateId = function generateId() {
                        return '2015-01-01-at-00-00-00000';
                    };

                    var complete = (err) => {
                        server.close();
                        if(main.after) main.after();
                        utils.generateId = _generateId;
                        done(err);
                    };

                    request(address, function(error, response, body) {
                        try {
                            if(main.checkResponse) {
                                response.body = body;
                                response.error = error;
                                main.checkResponse(response, chai.expect, helpers);
                                complete();
                            } else {
                                if(error) {
                                    return done(error);
                                }
                                chai.expect(response.statusCode).to.equal(200);

                                if(main.checkDOM)  {
                                    var jsdomOptions = {
                                        url:address,
                                        features: {
                                          FetchExternalResources : ['script']
                                        }
                                    }
                                    var window = jsdom(body, jsdomOptions).defaultView;
                                    if(main.checkDOM.length == 4) {
                                        main.checkDOM(window, window.document, chai.expect, complete);
                                    } else {
                                        main.checkDOM(window, window.document, chai.expect);
                                        complete();
                                    }
                                } else if(main.checkReportDOM) {
                                    var jsdomOptions = {
                                        url:address,
                                        features: {
                                          FetchExternalResources : ['script', 'iframe']
                                        }
                                    }
                                    var window = jsdom(body, jsdomOptions).defaultView;
                                    window.addEventListener('load', function() {
                                        var iframe = window.document.querySelector('#pnark-report iframe')
                                        iframe.addEventListener('load', function() {
                                            try {
                                                if(main.checkReportDOM.length == 4) {
                                                    main.checkReportDOM(iframe.contentWindow, iframe.contentWindow.document, chai.expect, complete);
                                                } else {
                                                    console.log('b')
                                                    main.checkReportDOM(iframe.contentWindow, iframe.contentWindow.document, chai.expect);
                                                    console.log('c')
                                                    complete();
                                                }
                                            } catch(e) {
                                                complete(e);
                                            }
                                        })
                                    })
                                } else {
                                    helpers.compare(body, '.html');
                                }
                            }
                        } catch(error) {
                            complete(error)
                        }
                    });
                });
            }
        });
});
