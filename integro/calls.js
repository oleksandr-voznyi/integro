const fs = require('fs')
const path = require('path')

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
                const methods = require(path.join(moduleDir, 'methods.js'))
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

module.exports = calls
