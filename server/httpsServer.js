const https = require('https')
const path = require('path')
const fs = require('fs')

const app = require('./app')

const option = {
  cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
  key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
}

const server = https.createServer(option, app)

server.listen(443, () => {
  console.log('server secure has started')
})