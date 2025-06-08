import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const calls = {
    methods: {}
}

calls.call = async function (method, params, call, emit) {
    let result = null

    if (typeof calls.methods[method] == 'function') {
        result = await calls.methods[method](method, params, call, emit)
    }

    return result
}

calls.load = async function () {
    let dirList = []
    try {
        dirList = await fs.promises.readdir(path.join(__dirname, '..', 'modules'))
    } catch (e) {}

    for (const i in dirList) {
        try {
            const moduleDir = path.join(__dirname, '..', 'modules', dirList[i])
            if (fs.existsSync(path.join(moduleDir, 'methods.js'))) {
                const fileUrl = pathToFileURL(path.join(moduleDir, 'methods.js')).href
                const methods = (await import(fileUrl)).default
                for (const i in methods) {
                    calls.methods[i] = methods[i]
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    
    return true
}

export default calls
