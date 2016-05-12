var Section = module.exports = function Section(config) {
    this.title = config.title
    this.parent = config.parent
    this.reporter = config.reporter
    this.typeConfig = config.typeConfig
    this.level = config.level || 0

    this.content = []
}

Section.Types = {}

Section.registerType = function(type, definition) {
    Section.prototype[type] = function(data) {
        if(!this.typeConfig[type]) {
            this.typeConfig[type] = {}
        }

        if(Section.Types[type].helper) {
            return Section.Types[type].helper.apply(this, arguments)
        }

        this.content.push({ type, data })
        return this
    }
    Section.Types[type] = definition
}

var section = Section.prototype

section.end = function end() {
    return this.parent
}

section.getHTML = function getHTML() {
    var html = ''

    if(this.title) {
        html += `<h${this.level}>
            <small>${this.reporter.name}</small>
            ${this.title}
        </h${this.level}>`
    }

    this.content.forEach(content => {
        html += Section.Types[content.type].getHTML.call(this, content.data, this.typeConfig[content.type])
    })

    return `<section>${html}</section>`
}

Section.registerType('section', {
    helper: function(title) {
        var subsection = new Section({
            title,
            parent: this,
            reporter: this.reporter,
            typeConfig:this.typeConfig,
            level: this.level + 1
        })

        this.content.push({ type:'section', data:subsection })

        return subsection
    },
    getHTML: (section) => section.getHTML()
})

Section.registerType('html', {
    getHTML: (html) => html
})

Section.registerType('text', {
    getHTML: (text) => '<p>'+text.trim().replace(/\n\n+/g, '</p><p>')+'</p>'
})

Section.registerType('markdown', {
    getHTML: function(markdown, config) {
        config.codeHighlighting = config.codeHighlighting || /```\S+/.test(markdown)
        return require('marked')(markdown)
    },
    getScripts: function(config) {
        if(config && config.codeHighlighting) return `
            <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/styles/agate.min.css" rel="stylesheet" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/highlight.min.js"></script>
            <script>hljs.initHighlightingOnLoad();</script>
        `
    }
})

Section.registerType('json', {
    helper: function(json) {
        var markdown = '```json\n'+JSON.stringify(json, null, 2)+'\n```'
        return this.markdown(markdown)
    }
})

Section.registerType('highchart', {
    getHTML: function(definition, config) {
        var chartId = `highchart-${Math.floor(Math.random()*1000000000)}`

        definition.chart = definition.chart || {}
        definition.chart.renderTo = chartId

        config.charts = config.charts || []
        config.charts.push(definition)

        return `<div id="${chartId}"></div>`
    },
    getScripts: function(config) {
        return `
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script>
                var charts = ${JSON.stringify(config.charts)};
                charts.forEach(function(chart) {
                    new Highcharts.Chart(chart);
                });
            </script>
        `
    }
})