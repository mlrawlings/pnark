exports.requestPath = '/test?pnark=*'

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

exports.checkDOM = function(window, document, expect, done) {
    expect(document.querySelector('#pnark-report')).to.exist
    expect(document.querySelector('#pnark-report iframe')).to.not.exist
    window.addEventListener('load', function() {
        var iframe = document.querySelector('#pnark-report iframe')
        expect(iframe).to.exist
        expect(iframe.getAttribute('src')).to.equal('/test?pnark=*&pnarkID=2015-01-01-at-00-00-00000')
        done()
    })
}
