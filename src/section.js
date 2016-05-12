var Section = module.exports = function Section(config) {
    this.title = config.title
    this.parent = config.parent
    this.reporter = config.reporter
    this.typeData = config.typeData
    this.level = config.level || 0

    this.content = []
}

Section.Types = {}

Section.registerType = function(type, definition) {
    Section.prototype[type] = function() {
        if(!(type in this.typeData)) {
            this.typeData[type] = undefined
        }

        if(Section.Types[type].helper) {
            return Section.Types[type].helper.apply(this, arguments)
        }

        this.content.push({ type, args:arguments })
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
        html += Section.Types[content.type].getHTML.apply(this, content.args)
    })

    return `<section>${html}</section>`
}

Section.registerType('section', {
    helper: function(title) {
        var subsection = new Section({
            title,
            parent: this,
            reporter: this.reporter,
            typeData:this.typeData,
            level: this.level + 1
        })

        this.content.push({ type:'section', args:[subsection] })

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
    getHTML: function(markdown) {
        var config = this.typeData.markdown = this.typeData.markdown || {}
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
    getHTML: function(definition) {
        var chartId = `highchart-${Math.floor(Math.random()*1000000000)}`

        definition.chart = definition.chart || {}
        definition.chart.renderTo = chartId

        this.typeData.highchart = this.typeData.highchart || []
        this.typeData.highchart.push(definition)

        return `<div id="${chartId}"></div>`
    },
    getScripts: function(definitions) {
        return `
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script>
                var charts = ${JSON.stringify(definitions)};
                charts.forEach(function(chart) {
                    new Highcharts.Chart(chart);
                });
            </script>
        `
    }
})