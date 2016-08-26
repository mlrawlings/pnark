var Pnark = require('../src/pnark')
var expect = require('chai').expect

describe('Pnark config', function() {
    var reporterA = function(a){}
    var reporterB = function(b){}

    it('should allow you to add reporters', function() {
        var pnark = new Pnark()

        pnark.addReporter('A', reporterA)

        expect(pnark.reporters).to.eql([{ name:'A', run:reporterA }])
    })

    it('should allow plugins', function() {
        var pnark = new Pnark()
        var plugin = function(p) {
            p.addReporter('A', reporterA)
            p.addReporter('B', reporterB)
        }

        pnark.use(plugin)

        expect(pnark.reporters).to.eql([
            { name:'A', run:reporterA },
            { name:'B', run:reporterB }
        ])
    })
})
