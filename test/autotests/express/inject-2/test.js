exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => { report.end() }
        }
    }))

    app.get('/test', function(req, res) {
        var content = `
            <!doctype html>
            <html>
            <body>
                <div>Hello World</div>
            </body>
            </html>
        `

        res.writeHead(200, {
            'Content-Type':'text/html',
            'Content-Length':''+content.length,
        })
        res.write(content)
        res.end()
    })
}

exports.checkDOM = function(window, document, expect, done) {
    expect(document.querySelector('#pnark-report')).to.exist
    expect(document.querySelector('#pnark-report iframe')).to.not.exist
    window.addEventListener('load', function() {
        var iframe = document.querySelector('#pnark-report iframe')
        expect(iframe).to.exist
        expect(iframe.getAttribute('src')).to.equal('/test?pnark=*&pnarkID=test-report')
        done()
    })
}
