exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                report.section('My Title')
                          .json({ a:[1,2,3], b:{ c:"foo", d:"bar", e:true }})
                          .html('<p>Hello World</p>')
                          .end()
                      .section('Section 2')
                          .markdown('Oh, *YES!*')
                          .end()
                      .end()
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
    expect(titles[0].innerHTML).to.include('My Title')
    expect(titles[1].innerHTML).to.include('Section 2')

    var code = document.querySelector('code.lang-json')
    expect(code).to.exist

    var paragraphs = document.querySelectorAll('p')
    expect(paragraphs.length).to.equal(2)
    expect(paragraphs[0].innerHTML).to.equal('Hello World')
    expect(paragraphs[1].innerHTML).to.equal('Oh, <em>YES!</em>')
}
