exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                report.section('My Title').html('<p>hi</p>')
                report.end()
            },
            bar: (report, req, res) => {
                report.section('My Other Title').html('<p>hi again</p>')
                report.end()
            }
        }
    }))

    app.get('/test', function(req, res) {
        res.set('Content-Type', 'text/html')
        res.send(`<div></div>`)
    })
}

exports.checkReportDOM = function(window, document, expect) {
    var titles = document.querySelectorAll('h1')

    expect(titles.length).to.equal(2)
    expect(titles[0].innerHTML).to.include('foo')
    expect(titles[0].innerHTML).to.include('My Title')
    expect(titles[1].innerHTML).to.include('bar')
    expect(titles[1].innerHTML).to.include('My Other Title')
}
