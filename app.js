import integro from './integro/index.js'

process.on('uncaughtException', function (e) {
    console.error(e)
})

async function init () {
    await integro.loadMethods()
    await integro.loadEvents()
    integro.startServer()
}

init()
