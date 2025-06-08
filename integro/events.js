import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
                const fileUrl = pathToFileURL(path.join(moduleDir, 'subscriptions.js')).href
                const subscriptions = (await import(fileUrl)).default
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

export default events
