var utils = require('./utils')
var EventEmitter = require('events').EventEmitter
var style = require('./client/report-style')
var Section = require('./section')

var Report = module.exports = function Report(reporters, req, res) {
  this.id = utils.generateId()
  this.reporters = reporters
  this.typeConfig = {}
  this.sections = []
  this.charts = []
  this.req = req
  this.res = res

  this.runReporters()
}

var report = Report.prototype = Object.create(EventEmitter.prototype)

report.runReporters = function runReporters() {
    var remaining = this.reporters.length
    this.reporters.forEach(reporter => {
        var section = new Section({
            reporter,
            typeConfig:this.typeConfig,
            level:0
        })

        section.end = () => {
            if(!--remaining) this.generate()
        }

        this.sections.push(section)
        reporter.run(section, this.req, this.res)
    })
}

report.generate = function generate() {
    setTimeout(() => {
        this.emit('complete', this.getHTML())
    })
}

report.getHTML = function getHTML(report) {
    var html = ''

    this.sections.forEach(section => {
        html += section.getHTML()
    })

    Object.keys(this.typeConfig).forEach(type => {
        var config = this.typeConfig[type]
        var getScripts = Section.Types[type].getScripts

        if(getScripts) {
            html += getScripts(config) || ''
        }
    })

    return `
        <!doctype html>
        <html>
        <head>
            <meta charset="UTF-8">
            ${style}
        </head>
        <body>
            ${html}
        </body>
        </html>
    `
}
