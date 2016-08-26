exports.requestPath = '/test'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        plugins:[pnark => {
            pnark.addReporter('foo', report => {
                report.section('My Title')
                      .json({ a:[1,2,3], b:{ c:"foo", d:"bar", e:true }})
                report.end()
            })
        }]
    }))

    app.get('/test', function(req, res) {
        res.set('Content-Type', 'text/html')
        res.send(`<div></div>`)
    })
}

exports.checkReportDOM = function(window, document, expect) {
    var title = document.querySelector('h2')
    expect(title).to.exist
    expect(title.innerHTML).to.include('My Title')

    var code = document.querySelector('code.lang-json')
    expect(code).to.exist

    var script = document.querySelector('script[src*=highlight]')
    expect(script).to.exist
}
