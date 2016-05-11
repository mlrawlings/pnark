var lave = require('lave')
var generate = require('escodegen').generate
var utils = require('./utils')

module.exports = (charts) => {
    var chartTypes = JSON.stringify(utils.dedupe(charts.map(c => c.type.toLowerCase())))
    var getChartDefinitions = lave(charts, {generate, format: 'function'})

    return `
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
            google.charts.load('current', { packages:${chartTypes} });
            google.charts.setOnLoadCallback(drawCharts);
            function drawCharts() {
                var getChartDefinitions = ${getChartDefinitions}
                var chartDefinitions = getChartDefinitions()

                chartDefinitions.forEach(function(chartDefinition) {
                    var container = document.getElementById(chartDefinition.id)
                    var chart = new google.visualization[chartDefinition.type](container)
                    var data = google.visualization.arrayToDataTable(
                        [chartDefinition.data.cols].concat(chartDefinition.data.rows)
                    )
                    chart.draw(data, chartDefinition.options)
                })
            }
        </script>
    `
}