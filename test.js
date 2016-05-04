var pnark = require('./index')
var expect = require('expect')

describe('parseParam', function() {
  it('should return an empty array if the parameter is undefined', function() {
    expect(pnark.parseParam()).toEqual([])
  })
  it('should return an an array [\'*\'] if the parameter is empty string', function() {
    expect(pnark.parseParam('')).toEqual(['*'])
  })
  it('should return an array of a single parameter', function() {
    expect(pnark.parseParam('async-fragment')).toEqual(['async-fragment'])
  })
  it('should return an array of multiple parameters', function() {
    expect(pnark.parseParam('async-fragment,tessa')).toEqual(['async-fragment', 'tessa'])
  })
})

describe('createConfiguration', function() {
  var pluginA = function(a){}
  var pluginB = function(b){}
  var pluginC = function(c){}
  it('should see these functions differently', function() {
    expect(pluginA).toNotEqual(pluginB)
  })
  it('should handle standard plugins', function() {
    var config = pnark.createConfiguration({
      plugins:{
        'foo':pluginA,
      },
    })

    expect(config).toEqual({ '*':[pluginA], 'foo':[pluginA] })
  })
  it('should handle namespaced plugins', function() {
    var config = pnark.createConfiguration({
      plugins:{
        'ns':{
          'foo':pluginA,
          'bar':pluginB,
        },
      },
    })

    expect(config).toEqual({
      '*':[pluginA, pluginB],
      'ns':[pluginA, pluginB],
      'ns:foo':[pluginA],
      'ns:bar':[pluginB],
    })
  })
  it('should handle bundled plugins', function() {
    var myBundle = {
      plugins:{
        'bar':pluginB
      }
    }

    var config = pnark.createConfiguration({
      plugins:{
        'foo':pluginA,
      },
      bundles:[myBundle]
    })

    expect(config).toEqual({
      '*':[pluginA, pluginB],
      'foo':[pluginA],
      'bar':[pluginB],
    })
  })
  it('should handle profiles', function() {
    var config = pnark.createConfiguration({
      profiles: {
        'test':['foo', 'bar'],
      },
      plugins:{
        'foo':pluginA,
        'bar':pluginB,
        'baz':pluginC,
      },
    })

    expect(config).toEqual({
      '*':[pluginA, pluginB, pluginC],
      'test':[pluginA, pluginB],
      'foo':[pluginA],
      'bar':[pluginB],
      'baz':[pluginC],
    })
  })
  it('should handle bundled profiles', function() {
    var myBundle = {
      profiles: {
        'test':['foo', 'bar'],
      },
      plugins:{
        'foo':pluginA,
        'bar':pluginB,
        'baz':pluginC,
      },
    }

    var config = pnark.createConfiguration({
      bundles:[myBundle],
    })

    expect(config).toEqual({
      '*':[pluginA, pluginB, pluginC],
      'test':[pluginA, pluginB],
      'foo':[pluginA],
      'bar':[pluginB],
      'baz':[pluginC],
    })
  })
})
