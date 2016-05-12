var utils = require('./utils')
var EventEmitter = require('events').EventEmitter
var getChartCode = require('./client/chart-code')
var style = require('./client/report-style')

var Report = module.exports = function Report(reporters, req, res) {
  this.id = utils.generateId()
  this.reporters = reporters
  this.sections = []
  this.charts = []
  this.req = req
  this.res = res

  this.runReporters()
}

var report = Report.prototype = Object.create(EventEmitter.prototype)

report.runReporters = function runReporters() {
    console.log('running reporters')
    var remaining = this.reporters.length
    this.reporters.forEach(reporter => {
        var section = { reporter:reporter.name, subsections:[] }
        var reportHelper = {
            section:(s) => {
                section.subsections.push(s)
            },
            end:() => {
                console.log('reporter complete')
                if(!--remaining) this.generate()
            }
        }

        this.sections.push(section)
        reporter.run(reportHelper, this.req, this.res)
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
        html += this.getSectionHTML(section, section.reporter)
    })

    if(this.charts.length) {
        html += getChartCode(this.charts)
    }

    return `
        <!doctype html>
        <html>
        <head>
            ${style}
        </head>
        <body>
            ${html}
        </body>
        </html>
    `
}

report.getSectionHTML = function getSectionHTML(section, reporter, level) {
    level = level || 0

    var html = ''

    if(section.title) {
        html += `<h${level}>
            <small>${reporter}</small>
            ${section.title}
        </h${level}>`
    }
    if(section.html) {
        html += section.html
    }
    if(section.text) {
        html += `<p>${utils.escapeXML(section.text)}</p>`
    }
    if(section.markdown) {
        html += utils.markdown(section.markdown)
    }
    if(section.chart) {
        var chartId = `chart-${Math.floor(Math.random()*1000000000)}`
        var chartType = section.chart
        var data = { cols:section.cols, rows:section.rows }
        var options = section.options

        this.charts.push({ id:chartId, type:chartType, data, options })

        html += `<div id="${chartId}"></div>`
    }
    if(section.subsections) {
        section.subsections.forEach(subsection => {
            html += this.getSectionHTML(subsection, reporter, level+1)
        })
    }

    return `<section>${html}</section>`
}
