"use strict"

var utils = require('./utils')
var style = require('./client/report-style')
var Section = require('./section')
var Subscription = require('./subscription')
var pretty = require('pretty')
var time = require('time-ms')

module.exports = class Report {
    constructor(reporters, req, res) {
        this.time = time()
        this.id = utils.generateId()
        this.reporters = reporters
        this.sections = []
        this.req = req
        this.res = res

        this.res.on('finish', () => {
            this.elapsed = time() - this.time
        })

        this.results = (
            this.runReporters()
        ).then(() =>
            this.awaitResponseEnd()
        ).then(() =>
            this.generateResults()
        )
    }
    runReporters() {
        return new Promise((resolve, reject) => {
            var remaining = this.reporters.length
            this.reporters.forEach(reporter => {
                var section = new Section({
                    reporter,
                    report:this,
                    level:1
                })

                section.end = () => {
                    if(!--remaining) resolve()
                }

                this.sections.push(section)
                reporter.run(section)
            })
        })
    }
    awaitResponseEnd() {
        return new Promise((resolve, reject) => {
            if(this.res.finished) resolve()
            else this.res.on('finish', resolve)
        })
    }
    generateResults() {
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
                <div class="tabbar"></div>
                ${body}
            </body>
            </html>
        `

        return { html, text }
    }
    subscribeTo(emitter) {
        return new Subscription(emitter, this.res)
    }
    collect(instrumitter, method, options) {
        var subscription = this.subscribeTo(instrumitter)
        var fns = []

        options = options || {}

        if(options.callback) {
            // by listening to callback, the callback data will be added
            // to the stored fn object once the callback is called
            subscription.on(method+':callback', () => {})
            delete options.callback
        }

        subscription.on(method+':invoke', options, fn => fns.push(fn))

        return subscription.then(() => {
            return fns.map(fn => {
                fn = Object.assign({}, fn)
                fn.time -= this.time
                if(fn.return) {
                    fn.return = Object.assign({}, fn.return)
                    fn.return.time -= this.time
                }
                if(fn.promise) {
                    fn.promise = Object.assign({}, fn.promise)
                    fn.promise.time -= this.time
                }
                if(fn.callback) {
                    fn.callback = Object.assign({}, fn.callback)
                    fn.callback.time -= this.time
                }
                return fn
            })
        })
    }
}