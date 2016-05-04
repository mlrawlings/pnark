var Pnark = require('./index')
var utils = require('./utils')
var expect = require('expect')

describe('parseParam', function() {
  it('should return an empty array if the parameter is undefined', function() {
    expect(utils.parseParam()).toEqual([])
  })
  it('should return an an array [\'*\'] if the parameter is empty string', function() {
    expect(utils.parseParam('')).toEqual(['*'])
  })
  it('should return an array of a single parameter', function() {
    expect(utils.parseParam('async-fragment')).toEqual(['async-fragment'])
  })
  it('should return an array of multiple parameters', function() {
    expect(utils.parseParam('async-fragment,tessa,test')).toEqual(['async-fragment', 'tessa', 'test'])
  })
})

describe('Pnark', function() {
  var reporterA = function(a){}
  var reporterB = function(b){}
  var reporterC = function(c){}

  it('should see these functions differently', function() {
    expect(reporterA).toNotEqual(reporterB)
  })

  it('should handle top-level reporters', function() {
    var pnark = new Pnark({
      reporters:{
        'foo':reporterA,
      },
    })

    expect(pnark.config).toEqual({ '*':[reporterA], 'foo':[reporterA] })
  })

  it('should handle namespaced reporters', function() {
    var pnark = new Pnark({
      reporters:{
        'ns':{
          'foo':reporterA,
          'bar':reporterB,
        },
      },
    })

    expect(pnark.config).toEqual({
      '*':[reporterA, reporterB],
      'ns':[reporterA, reporterB],
      'ns:foo':[reporterA],
      'ns:bar':[reporterB],
    })
  })

  it('should handle plugins', function() {
    var myPlugin = {
      reporters:{
        'bar':reporterB
      }
    }

    var pnark = new Pnark({
      reporters:{
        'foo':reporterA,
      },
      plugins:[myPlugin]
    })

    expect(pnark.config).toEqual({
      '*':[reporterA, reporterB],
      'foo':[reporterA],
      'bar':[reporterB],
    })
  })
  it('should handle profiles', function() {
    var pnark = new Pnark({
      profiles: {
        'test':['foo', 'bar'],
      },
      reporters:{
        'foo':reporterA,
        'bar':reporterB,
        'baz':reporterC,
      },
    })

    expect(pnark.config).toEqual({
      '*':[reporterA, reporterB, reporterC],
      'test':[reporterA, reporterB],
      'foo':[reporterA],
      'bar':[reporterB],
      'baz':[reporterC],
    })
  })

  it('should handle profiles defined in plugins', function() {
    var myPlugin = {
      profiles: {
        'test':['foo', 'bar'],
      },
      reporters:{
        'foo':reporterA,
        'bar':reporterB,
        'baz':reporterC,
      },
    }

    var pnark = new Pnark({
      plugins:[myPlugin],
    })

    expect(pnark.config).toEqual({
      '*':[reporterA, reporterB, reporterC],
      'test':[reporterA, reporterB],
      'foo':[reporterA],
      'bar':[reporterB],
      'baz':[reporterC],
    })
  })
})
