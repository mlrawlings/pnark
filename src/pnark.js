var fs = require('fs')
var path = require('path')
var utils = require('./utils')
var PassThrough = require('stream').PassThrough
var Report = require('./report')

var Pnark = module.exports = function Pnark(options) {
  this.reporters = { '*':[] }
  this.reports = {}
  this.reportDirectory = options.reportDirectory

  this.setupReporters(options.reporters)
  this.setupPlugins(options.plugins)
  this.setupProfiles(options.profiles)
}

var pnark = Pnark.prototype

pnark.addToReporters = function addToReporters(key, value) {
  this.reporters[key] = this.reporters[key] || []
  if(Array.isArray(value)) {
    this.reporters[key] = this.reporters[key].concat(value)
  } else {
    this.reporters[key].push(value)
  }
}

pnark.setupPlugins = function setupPlugins(plugins) {
  if(!plugins) return

  plugins.forEach(plugin => this.setupReporters(plugin.reporters))
  plugins.forEach(plugin => this.setupProfiles(plugin.profiles))
}

pnark.setupProfiles = function setupProfiles(profiles) {
  if(typeof profiles === 'undefined') return

  if(profiles.constructor !== Object) {
    throw new Error('profiles must be an object defining an array of namespaces and reporters')
  }

  var profileNames = Object.keys(profiles)

  profileNames.forEach(name => {
    var profile = profiles[name]

    if(!Array.isArray(profile)) {
      throw new Error('a profile must be an array of namespaces and reporters')
    }

    profile.forEach(p => this.addToReporters(name, this.reporters[p]))
  })
}

pnark.setupReporters = function setupReporters(reporters, ns) {
  if(typeof reporters === 'undefined') return

  if(reporters.constructor !== Object) {
    ns = ns || 'root'
    throw new Error(ns + ' namespace must be an object of reporters')
  }

  var reporterNames = Object.keys(reporters)

  reporterNames.forEach(name => {
    var reporter = reporters[name]

    if(ns) name = ns + ':' + name

    var definition = { name, run:reporter }

    if(typeof reporter == 'function') {
      this.addToReporters('*', definition)
      this.addToReporters(name, definition)
      if(ns) this.addToReporters(ns, definition)
    } else {
      this.setupReporters(reporter, name)
    }
  })
}

pnark.generateReport = function(reporterNames, req, res) {
    var reporters = this.getReporters(reporterNames)
    var report = new Report(reporters, req, res)

    this.reports[report.id] = report

    report.on('complete', html => {
        delete this.reports[report.id]

        var reportFilePath = this.getReportPath(report.id)
        var stream = fs.createWriteStream(reportFilePath)

        stream.write(html)
        stream.end()
    })

    return report
}

pnark.getReportPath = function getReportPath(id) {
    return path.join(this.reportDirectory, id+'.html')
}

pnark.getReporters = function getReporters(reporterNames) {
    if(typeof reporterNames === 'string') {
        reporterNames = reporterNames.split(/,/g)
    }

    var reporters = []

    reporterNames.forEach(name => {
        reporters = reporters.concat(this.reporters[name])
    })

    return reporters
}

pnark.getReport = function(id) {
    var report = this.reports[id]
    var reportFilePath = this.getReportPath(id)

    if(report) {
        var stream = new PassThrough()
        report.on('complete', html => {
            stream.write(html)
            stream.end()
        })
        return stream;
    }

    return fs.createReadStream(reportFilePath)
}