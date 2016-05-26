var Section = module.exports = function Section(config) {
    this.title = config.title
    this.parent = config.parent
    this.reporter = config.reporter
    this.typeConfig = config.typeConfig
    this.level = config.level || 0

    this.content = []
}

var section = Section.prototype

section.html = function(html) {
    return this.write(html, 'html')
}

section.markdown = function(markdown) {
    return this.write(markdown, 'markdown')
}

section.json = function(data) {
    return this.write(data, 'json')
}

section.text = function(text) {
    return this.write(text, 'text')
}

section.chart = function(data) {
    return this.write(data, 'chart')
}

section.section = function(title) {
    var section = new Section({
        title,
        parent: this,
        reporter: this.reporter,
        typeConfig:this.typeConfig,
        level: this.level + 1
    })

    this.write(section, 'section')

    return section
}

section.write = function write(data, formatter) {
    if(!formatter) {
        formatter = Section.formatters.text
    }
    if(typeof formatter === 'string') {
        formatter = Section.formatters[formatter]
    }
    this.content.push({ data, formatter })
    return this
}

section.end = function end() {
    if(arguments.length) {
        this.write.apply(this, arguments)
    }
    return this.parent
}

section.format = function format() {
    var html = ''
    var text = ''
    var resources = { css:[], js:[] }

    if(this.title) {
        html += `<h${this.level}>
            <small>${this.reporter.name}</small>
            ${this.title}
        </h${this.level}>`

        text += this.title + ' | ' + this.reporter.name + '\n'
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
    var resources = { css:[], js:[] }
    var chartId = `highchart-${Math.floor(Math.random()*1000000000)}`

    data.chart = data.chart || {}
    data.chart.renderTo = chartId

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
    resources.js.push(`<script>
        new Highcharts.Chart(${JSON.stringify(data)});
    </script>`)

    return {
        html:`<div id="${chartId}"></div>`,
        text:JSON.stringify(data, null, 2),
        resources
    }
}