var Pnark = require('./src/pnark')
var getInjectionCode = require('./src/injection-code')

module.exports = function(options) {
    var pnark = new Pnark(options)

    return function pnarkExpress(req, res, next) {
        var id = req.query.pnarkID
        var reporters = req.query.pnark

        if(id) {
            res.set({ 'content-type':'text/html; charset=utf-8' })
            return pnark.getReport(id).pipe(res)
        }

        if(reporters) {
            var _end = res.end
            var _setHeader = res.setHeader
            var _writeHead = res.writeHead
            var report = pnark.generateReport(reporters, req, res)
            var code = getInjectionCode(report)

            res.setHeader = function setHeader(name, value) {
                if(name.toLowerCase() == 'content-length') {
                    value = ''+parseInt(value)+code.length
                }
                _setHeader.call(this, name, value)
            }

            res.writeHead = function writeHead(statusCode, message, headers) {
                if(!headers && typeof message == 'object') {
                    headers = message
                    message = undefined
                }
                headers && Object.keys(headers).forEach(name => {
                    if(name.toLowerCase() == 'content-length') {
                        headers[name] = ''+parseInt(headers[name])+code.length
                    }
                })
                _writeHead.apply(this, arguments)
            }

            res.end = function end(data, encoding, callback) {
                if(data) this.write(data.toString(), encoding)
                this.write(code, 'utf-8')
                _end.apply(this)
            }
        }

        next()
    }
}