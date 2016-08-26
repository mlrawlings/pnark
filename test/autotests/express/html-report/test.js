exports.requestPath = '/test'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        plugins:[pnark => {
            pnark.addReporter('foo', report => {
                report.section('My Title')
                      .html('<p>Hello World</p>')
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

    var paragraph = document.querySelector('p')
    expect(paragraph).to.exist
    expect(paragraph.innerHTML).to.equal('Hello World')
}
