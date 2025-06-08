import 'dotenv/config'
import server from './server.js'
import eventsModule from './events.js'
import callsModule from './calls.js'
import { pathToFileURL } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let events = eventsModule
let calls = callsModule

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
                const cacheBuster = '?update=' + Date.now()
                events = (await import('./events.js' + cacheBuster)).default
                await events.load()
                calls = (await import('./calls.js' + cacheBuster)).default
                await calls.load()
                await import('dotenv/config')
            }
        }

        path[1] = path[1].split('?')[0]
        path[1] = path[1] || 'index'
        try {
            const modPath = require.resolve('../modules/' + path[1])
            const mod = await import(pathToFileURL(modPath).href)
            const handler = mod.default || mod
            handler(req, res, integro.call, integro.emit)
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

export default integro
