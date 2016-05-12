exports.requestPath = '/test'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => { report.end() }
        }
    }))

    app.get('/test', function(req, res) {
        res.set('Content-Type', 'text/html')
        res.send(`
            <!doctype html>
            <html>
            <body>
                <div>Hello World</div>
            </body>
            </html>
        `)
    })
}

exports.checkDOM = function(window, document, expect) {
    expect(document.querySelector('#pnark-report')).to.not.exist
}
