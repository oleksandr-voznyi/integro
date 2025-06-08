export default async function (req, res, call, emit) {
    res.sendStatus(200)
    
    emit(req.url.split('?')[0], {
        headers: req.headers,
        query: req.query,
        body: req.body
    })
}