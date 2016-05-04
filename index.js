var Pnark = module.exports = function Pnark(options) {
  this.config = { '*':[] }

  this.addReporters(options.reporters)
  this.addPlugins(options.plugins)
  this.addProfiles(options.profiles)
}

var pnark = Pnark.prototype

pnark.addToConfig = function addToConfig(key, value) {
  config[key] = config[key] || []
  if(Array.isArray(value)) {
    config[key] = config[key].concat(value)
  } else {
    config[key].push(value)
  }
}

pnark.addPlugins = function addPlugins(plugins) {
  if(!plugins) return

  plugins.forEach(plugin => this.addReporters(plugin.reporters))
  plugins.forEach(plugin => this.addProfiles(plugin.profiles))
}

pnark.addProfiles = function addProfiles(profiles) {
  if(typeof profiles === 'undefined') return

  if(typeof profiles !== 'object') {
    throw new Error('profiles must be an object defining an array of namespaces and reporters')
  }

  var profileNames = Object.keys(profiles)

  profileNames.forEach(name => {
    var profile = profiles[name]

    if(!Array.isArray(profile)) {
      throw new Error('a profile must be an array of namespaces and reporters')
    }

    profile.forEach(p => this.addToConfig(name, config[p]))
  })
}

pnark.addReporters = function addReporters(reporters, ns) {
  if(typeof reporters === 'undefined') return

  if(typeof reporters !== 'object') {
    ns = ns || 'root'
    throw new Error(ns + ' namespace must be an object of reporters')
  }

  var reporterNames = Object.keys(reporters)

  reporterNames.forEach(name => {
    var reporter = reporters[name]

    if(ns) name = ns + ':' + name

    if(typeof reporter == 'function') {
      this.addToConfig('*', reporter)
      this.addToConfig(name, reporter)
      if(ns) this.addToConfig(ns, reporter)
    } else {
      this.addReporters(reporter, name)
    }
  })
}

pnark.handleRequest = function(req, res, param, config) {

}
