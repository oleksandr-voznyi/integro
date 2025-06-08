import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import http from 'http'
import path from 'path'

const app = express()
const forms = multer()

function server (callback) {
  const viewEngine = process.env.VIEW_ENGINE || 'ejs'
  app.set('view engine', viewEngine);

  const limit = process.env.UPLOAD_LIMIT || '1024kb'

  app.use(bodyParser.json({ limit }))
  app.use(forms.array())
  app.use(bodyParser.urlencoded({
    limit,
    extended: true
  }))
  app.use(bodyParser.text({
    limit,
    type: 'application/xml'
  }))

  app.all('*', function (req, res) {
    callback(req, res)
  })

  const srv = http.createServer(app)

  const port = process.env.PORT || 4444
  srv.listen(port)
  console.log('server started at ', port)
}

export default server
