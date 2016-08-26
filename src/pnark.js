"use strict"

var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var utils = require('./utils')
var PassThrough = require('stream').PassThrough
var Report = require('./report')

module.exports = class Pnark{
    constructor(options) {
        options = options || {}

        this.reports = {}
        this.reporters = []
        this.reportDirectory = options.reportDirectory || path.join(process.cwd(), '.cache/pnark')

        ;(options.plugins || []).forEach(plugin => this.use(plugin))
    }

    use(fn) {
        fn(this)
        return this
    }

    addReporter(name, run) {
        this.reporters.push({ name, run })
    }

    generateReport(req, res) {
        var report = new Report(this.reporters, req, res)

        this.reports[report.id] = report

        Promise.resolve(report.results).then(results => {
            mkdirp(this.reportDirectory, () => {
                delete this.reports[report.id]
                var reportFilePath = this.getReportPath(report.id)
                var stream = fs.createWriteStream(reportFilePath)

                stream.write(results.html)
                stream.end()
            })
        })

        return report
    }

    getReportPath(id) {
        return path.join(this.reportDirectory, id+'.html')
    }

    getReport(id) {
        var report = this.reports[id]
        var reportFilePath = this.getReportPath(id)

        if(report) {
            var stream = new PassThrough()
            Promise.resolve(report.results).then(results => {
                stream.write(results.html)
                stream.end()
            })
            return stream;
        }

        return fs.createReadStream(reportFilePath)
    }

}