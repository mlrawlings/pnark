var Pnark = require('./src/pnark')
var getInjectionCode = require('./src/client/injection-code')
var fs = require('fs')

module.exports = function(options) {
    var pnark = new Pnark(options)

    return function pnarkExpress(req, res, next) {
        var id = req.query.pnarkID
        var isHTML = false

        if(id) {
            res.set({ 'content-type':'text/html; charset=utf-8' })
            return pnark.getReport(id).pipe(res)
        }

        if(req.url === '/pnark/img/inspect.png') {
            return fs.createReadStream(require.resolve('./img/inspect.png')).pipe(res)
        }

        if(req.url === '/pnark/img/arrow.png') {
            return fs.createReadStream(require.resolve('./img/arrow.png')).pipe(res)
        }

        var _end = res.end
        var _setHeader = res.setHeader
        var _writeHead = res.writeHead
        var report = pnark.generateReport(req, res)
        var code = getInjectionCode(report)

        res.setHeader = function setHeader(name, value) {
            if(name.toLowerCase() == 'content-type') {
                isHTML = value.toLowerCase().indexOf('html') != -1
            }
            if(isHTML && name.toLowerCase() == 'content-length') {
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
                if(name.toLowerCase() == 'content-type') {
                    isHTML = headers[name].toLowerCase().indexOf('html') != -1
                }
                if(isHTML && name.toLowerCase() == 'content-length') {
                    headers[name] = ''+parseInt(headers[name])+code.length
                }
            })
            _writeHead.apply(this, arguments)
        }

        res.end = function end(data, encoding, callback) {
            if(data) this.write(data.toString(), encoding)
            if(isHTML) this.write(code, 'utf-8')
            _end.apply(this)
        }

        next()
    }
}