exports.requestPath = '/test'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        plugins:[pnark => {
            pnark.addReporter('foo', report => {
                report.section('My Title').html('<p>hi</p>')
                report.end()
            })
            pnark.addReporter('bar', report => {
                report.section('My Other Title').html('<p>hi again</p>')
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
    var titles = document.querySelectorAll('h2')

    expect(titles.length).to.equal(2)
    expect(titles[0].innerHTML).to.include('My Title')
    expect(titles[1].innerHTML).to.include('My Other Title')
}
