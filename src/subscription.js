"use strict"

class Subscription {
    constructor(emitter, res) {
        this.emitter = emitter
        this.listeners = []
        this.promise = new Promise((resolve, reject) => {
            res.on('finish', () => {
                this.listeners.forEach(listener => {
                    emitter.removeListener(listener.event, listener.handler)
                })
                resolve()
            })
        })
    }
    then(fn, errFn) {
        return this.promise.then(fn, errFn)
    }
    catch(errFn) {
        return this.promise.catch(errFn)
    }
    on() {
        var event = arguments[0]
        var handler = arguments[arguments.length-1]
        this.listeners.push({ event, handler })
        this.emitter.on.apply(this.emitter, arguments)
        return this
    }
}

module.exports = Subscription