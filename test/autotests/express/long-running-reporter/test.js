exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                report.section('My Title').html('<p>hi</p>')

                setTimeout(() => report.end(), 1000)
            }
        }
    }))

    app.get('/test', function(req, res) {
        res.set('Content-Type', 'text/html')
        res.send(`<div></div>`)
    })
}

exports.checkReportDOM = function(window, document, expect) {
    var title = document.querySelector('h1')
    expect(title.innerHTML).to.include('foo')
    expect(title.innerHTML).to.include('My Title')
}
