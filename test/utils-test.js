var utils = require('../src/utils')
var expect = require('chai').expect
var MockDate = require('mockdate')

describe('pad', function() {
    var pad = utils.pad

    it('pad(0, 2) => 00', function() {
        expect(pad(0, 2)).to.equal('00')
    })

    it('pad(10, 2) => 10', function() {
        expect(pad(10, 2)).to.equal('10')
    })

    it('pad(23, 3) => 023', function() {
        expect(pad(23, 3)).to.equal('023')
    })

    it('pad(123, 2) => 123', function() {
        expect(pad(123, 2)).to.equal('123')
    })
})

describe('generateId', function() {
    var generateId = utils.generateId

    it('should generate an id based on the current datetime', function() {
        MockDate.set('1/1/2016')
        expect(generateId()).to.equal('2016-01-01-at-00-00-00000')
        MockDate.reset()
    })
})

describe('dedupe', function() {
    var dedupe = utils.dedupe

    it('[1,2,3,1] => [1,2,3]', function() {
        expect(dedupe([1,2,3,1])).to.eql([1,2,3])
    })
})