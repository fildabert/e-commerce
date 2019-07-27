const app = require("./app")
const http = require("http")

const server = http.createServer(app)

server.listen(80, () => console.log("HTTP server is listening on port 80"))