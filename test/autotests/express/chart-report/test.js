exports.requestPath = '/test?pnark=*'

exports.initApp = function(app, middleware) {
    app.use(middleware({
        reportDirectory:__dirname,
        reporters:{
            foo: (report, req, res) => {
                var section = report.section('My Title')

                section.highchart({
                    title: {
                        text: 'Monthly Average Temperature'
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    yAxis: {
                        title: 'Temperature (°C)'
                    },
                    tooltip: {
                        valueSuffix: '°C'
                    },
                    series: [{
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
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
    var chartPlaceholder = document.querySelector('div[id^=highchart]')
    expect(chartPlaceholder).to.exist
    expect(chartPlaceholder.innerHTML).to.equal('')
}
