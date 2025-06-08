require('dotenv').config()
const server = require('./server')
let events = require('./events')
let calls = require('./calls')

const integro = {} 

integro.call = async function (method, params) {
    return await calls.call(method, params, integro.call, integro.emit)
}

integro.emit = async function (event, params) {
    events.emit(event, params, integro.call, integro.emit)
}

integro.startServer = function () {
    server(async function (req, res) {
        const path = req.url.split('/')

        if (process.env.RELOAD_TOKEN) {
            const query = req.url.split('?')[1] || ''
            if (query.indexOf('reload=' + process.env.RELOAD_TOKEN) !== -1) {
                console.log('clearRequireCache')
                const keyList = Object.keys(require.cache)
                for (const key of keyList) {
                    delete require.cache[key]
                }
                
                events = require('./events')
                await events.load()
                calls = require('./calls')
                await calls.load()
                require('dotenv').config({ override: true })
            }
        }

        path[1] = path[1].split('?')[0]
        path[1] = path[1] || 'index'
        try {
            const mod = require('../modules/' + path[1])
            mod(req, res, integro.call, integro.emit)
        } catch (e) {
            // console.error(e)
            res.sendStatus(404)
        }
    })
}

integro.loadMethods = async function () {
    await calls.load()
}

integro.loadEvents = async function () {
    await events.load()
    integro.emit('startup', {})
}

module.exports = integro
