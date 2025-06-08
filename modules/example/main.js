const main = {}

main.do = async function (method, params, call, emit) {
    console.log(method, params)

    return true
}

main.process = async function (event, params, call, emit) {
    console.log(event, params)

    const result = await call('/example/do', params)
    console.log(result)
}

export default main