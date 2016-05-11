exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                report.section({
                    title:'My Title',
                    chart:'Timeline',
                    cols:[
                        { type:'string', id:'Name' },
                        { type:'date', id:'Start' },
                        { type:'date', id:'Finish' }
                    ],
                    rows:[
                        [ 'First', new Date(), new Date() ],
                        [ 'Second', new Date(), new Date() ]
                    ],
                })
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
    var chartPlaceholder = document.querySelector('div[id^=chart]')
    expect(chartPlaceholder).to.exist
    expect(chartPlaceholder.innerHTML).to.equal('')
}
