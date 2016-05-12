exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                report.section('My Title')
                      .json({ a:[1,2,3], b:{ c:"foo", d:"bar", e:true }})
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
    var title = document.querySelector('h1')
    expect(title).to.exist
    expect(title.innerHTML).to.include('My Title')

    var subtitle = document.querySelector('h1 small')
    expect(subtitle).to.exist
    expect(subtitle.innerHTML).to.equal('foo')

    var code = document.querySelector('code.lang-json')
    expect(code).to.exist
}
