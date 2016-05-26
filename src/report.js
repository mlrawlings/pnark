var utils = require('./utils')
var style = require('./client/report-style')
var Section = require('./section')
var pretty = require('pretty')

var Report = module.exports = function Report(reporters, req, res) {
    this.id = utils.generateId()
    this.reporters = reporters
    this.sections = []
    this.req = req
    this.res = res

    this.results = (
        this.runReporters()
    ).then(() =>
        this.awaitResponseEnd()
    ).then(() =>
        this.generateResults()
    )
}

var report = Report.prototype

report.runReporters = function runReporters() {
    return new Promise((resolve, reject) => {
        var remaining = this.reporters.length
        this.reporters.forEach(reporter => {
            var section = new Section({
                reporter,
                typeConfig:this.typeConfig,
                level:0
            })

            section.end = () => {
                if(!--remaining) resolve()
            }

            this.sections.push(section)
            reporter.run(section, this.req, this.res)
        })
    })
}

report.awaitResponseEnd = function awaitResponseEnd() {
    return new Promise((resolve, reject) => {
        if(this.res.finished) resolve()
        else this.res.on('finish', resolve)
    })
}

report.generateResults = function getContent(report) {
    var head = style
    var body = ''
    var text = ''
    var resources = { js:[], css:[] }

    this.sections.forEach(section => {
        var result = section.format()
        body += result.html
        text += result.text +'\n\n'

        if(result.resources && result.resources.css) {
            [].push.apply(resources.css, result.resources.css)
        }

        if(result.resources && result.resources.js) {
            [].push.apply(resources.js, result.resources.js)
        }
    })

    utils.dedupe(resources.css).forEach(css => {
        if(/^<style|^<link/.test(css)) {
            return head += css
        }

        head += `<link rel="stylesheet" href="${css}" />`
    })

    utils.dedupe(resources.js).forEach(js => {
        if(/^<script/.test(js)) {
            return body += js
        }

        body += `<script src="${js}"></script>`
    })

    var html = `
        <!doctype html>
        <html>
        <head>
            <meta charset="UTF-8">
            ${head}
        </head>
        <body>
            ${body}
        </body>
        </html>
    `

    return this.results = { html, text }
}
