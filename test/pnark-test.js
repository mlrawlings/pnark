var Pnark = require('../src/pnark')
var expect = require('chai').expect

describe('Pnark', function() {
  var reporterA = function(a){}
  var reporterB = function(b){}
  var reporterC = function(c){}

  it('should see these functions differently', function() {
    expect(reporterA).to.not.equal(reporterB)
  })

  it('should handle top-level reporters', function() {
    var pnark = new Pnark({
      reporters:{
        'foo':reporterA,
      },
    })

    expect(pnark.reporters).to.eql({ '*':[{ name:'foo', run:reporterA }], 'foo':[{ name:'foo', run:reporterA }] })
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

    expect(pnark.reporters).to.eql({
      '*':[{ name:'ns:foo', run:reporterA }, { name:'ns:bar', run:reporterB }],
      'ns':[{ name:'ns:foo', run:reporterA }, { name:'ns:bar', run:reporterB }],
      'ns:foo':[{ name:'ns:foo', run:reporterA }],
      'ns:bar':[{ name:'ns:bar', run:reporterB }],
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

    expect(pnark.reporters).to.eql({
      '*':[{ name:'foo', run:reporterA }, { name:'bar', run:reporterB }],
      'foo':[{ name:'foo', run:reporterA }],
      'bar':[{ name:'bar', run:reporterB }],
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

    expect(pnark.reporters).to.eql({
      '*':[{ name:'foo', run:reporterA }, { name:'bar', run:reporterB }, { name:'baz', run:reporterC }],
      'test':[{ name:'foo', run:reporterA }, { name:'bar', run:reporterB }],
      'foo':[{ name:'foo', run:reporterA }],
      'bar':[{ name:'bar', run:reporterB }],
      'baz':[{ name:'baz', run:reporterC }],
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

    expect(pnark.reporters).to.eql({
      '*':[{ name:'foo', run:reporterA }, { name:'bar', run:reporterB }, { name:'baz', run:reporterC }],
      'test':[{ name:'foo', run:reporterA }, { name:'bar', run:reporterB }],
      'foo':[{ name:'foo', run:reporterA }],
      'bar':[{ name:'bar', run:reporterB }],
      'baz':[{ name:'baz', run:reporterC }],
    })
  })
})
