const fs = require('fs')
const path = require('path')

const events = {
    list: {}
}

events.emit = function (event, params, call, emit) {
    if (events.list[event]) {
        for (const i in events.list[event]) {
            const func = events.list[event][i]
            func(event, params, call, emit)
        }
    }
}

events.load = async function () {

    let dirList = []
    try {
        dirList = await fs.promises.readdir(path.join(__dirname, '..', 'modules'))
    } catch (e) {}

    for (const i in dirList) {
        try {
            const moduleDir = path.join(__dirname, '..', 'modules', dirList[i])
            if (fs.existsSync(path.join(moduleDir, 'subscriptions.js'))) {
                const subscriptions = require(path.join(moduleDir, 'subscriptions.js'))
                for (const i in subscriptions) {
                    events.list[i] = events.list[i] || []
                    events.list[i].push(subscriptions[i])
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    
    return true
    
}

module.exports = events
