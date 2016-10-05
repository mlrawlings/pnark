"use strict"

class Section {
    constructor(config) {
        this.id = config.id
        this._title = config.title
        this.parent = config.parent
        this.report = config.report
        this.reporter = config.reporter
        this.level = config.level || 0
        this.content = []
    }

    title(title) {
        this._title = title
        return this
    }

    collect() {
        return this.report.collect.apply(this.report, arguments)
    }

    subscribeTo() {
        return this.report.subscribeTo.apply(this.report, arguments)
    }

    html(html) {
        return this.write(html, 'html')
    }

    markdown(markdown) {
        return this.write(markdown, 'markdown')
    }

    json(data) {
        return this.write(data, 'json')
    }

    text(text) {
        return this.write(text, 'text')
    }

    chart(data) {
        return this.write(data, 'chart')
    }

    section(title, id) {
        var section = new Section({
            id,
            title,
            parent: this,
            report: this.report,
            reporter: this.reporter,
            level: this.level + 1
        })

        this.write(section, 'section')

        return section
    }

    write(data, formatter) {
        if(!formatter) {
            formatter = Section.formatters.text
        }
        if(typeof formatter === 'string') {
            formatter = Section.formatters[formatter]
        }
        this.content.push({ data, formatter })
        return this
    }

    up() {
        return this.parent
    }

    end() {
        return this.report.end()
    }

    format() {
        var html = ''
        var text = ''
        var resources = { css:[], js:[] }

        if(this._title) {
            html += `<h${this.level}${this.id ? ' id="'+this.id+'"' : ''}>
                ${this._title}
            </h${this.level}>`

            text += this._title + ' | ' + this.reporter.name + '\n'
        }

        this.content.forEach(content => {
            var data = content.data
            var result = content.formatter(content.data)

            html += result.html
            text += '\n' + result.text + '\n'

            if(result.resources && result.resources.css) {
                [].push.apply(resources.css, result.resources.css)
            }

            if(result.resources && result.resources.js) {
                [].push.apply(resources.js, result.resources.js)
            }
        })

        return {
            html:`<section>${html}</section>`,
            text,
            resources
        }
    }
}

module.exports = Section

Section.formatters = {}

Section.formatters.section = (section) => section.format()

Section.formatters.html = (html) => {
    return { html, text:html }
}

Section.formatters.text = (text) => {
    return { html:'<p>'+text.trim().replace(/\n\n+/g, '</p><p>')+'</p>', text }
}

Section.formatters.markdown = (markdown) => {
    var hasCode = /```\S+/.test(markdown)
    var resources = { css:[], js:[] }

    if(hasCode) {
        resources.css.push('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/styles/github.min.css')
        resources.css.push(`<style>
            .hljs {
                border:0.588em solid #f6f6f6;
                background-color:#fbfbfb;
                padding:1em;
            }
            .hljs:before, .hljs:after {
                content:'';
            }
        </style>`)
        resources.js.push('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/highlight.min.js')
        resources.js.push('<script>hljs.initHighlightingOnLoad();</script>')
    }

    return {
        html:require('marked')(markdown),
        text:markdown,
        resources
    }
}

Section.formatters.json = (data) => {
    var json = JSON.stringify(data, null, 2)
    var markdown = '```json\n'+json+'\n```'
    var results = Section.formatters.markdown(markdown)

    return {
        html:results.html,
        text:json,
        resources:results.resources
    }
}

Section.formatters.chart = (data) => {
    var lave = require('lave')
    var generate = require('escodegen').generate
    var resources = { css:[], js:[] }
    var chartId = `highchart-${Math.floor(Math.random()*1000000000)}`

    data.chart = data.chart || {}
    data.chart.renderTo = chartId
    var dataCode = lave(data, { generate, format:'function' }).replace(/;$/, '()')

    resources.css.push(`<style>
        [id^=highchart-] {
            border:0.5em solid #f6f6f6;
            background: #f6f6f6;
            border-radius:3px;
        }
        .highcharts-container {
            border-radius:2px;
        }
    </style>`)

    resources.js.push('https://code.highcharts.com/highcharts.js')
    resources.js.push('https://code.highcharts.com/highcharts-more.js')
    resources.js.push(`<script>
        new Highcharts.Chart(${dataCode});
    </script>`)

    return {
        html:`<div id="${chartId}" style="height:${data.height}px;"></div>`,
        text:JSON.stringify(data, null, 2),
        resources
    }
}