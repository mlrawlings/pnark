var generateId = exports.generateId = function generateId() {
    var now = new Date()

    return (
        now.getFullYear() + '-' +
        pad(now.getMonth()+1, 2) + '-' +
        pad(now.getDate(), 2) + '-at-' +
        pad(now.getHours(), 2) + '-' +
        pad(now.getMinutes(), 2) + '-' +
        pad(now.getSeconds(), 2) + pad(now.getMilliseconds(), 3)
    )
}

var pad = exports.pad = function pad(number, digits) {
    var padding = '';

    while(number <= Math.pow(10, --digits)-1) {
        if(digits) padding += '0'
        else break
    }

    return padding+number
}

var dedupe = exports.dedupe = function dedupe(array) {
    var hash = {}
    array.forEach(i => hash[i] = i)
    return Object.keys(hash).map(i => hash[i])
}