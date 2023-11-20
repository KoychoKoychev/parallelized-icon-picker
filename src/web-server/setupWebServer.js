const http = require('http');
const url = require('url');


function createWebServer() {
    const server = http.createServer((req, res) => {
        try {
            const queryObject = url.parse(req.url, true).query;
            let pathname = url.parse(req.url, true).pathname;
            const specialChars = /[ `!@#$%^&*()_+=\[\]{};':"\\|,<>\/?~]/;
            let requestEnded = false;
            req.on('error', () => {
                res.writeHead(503, { 'Content-Type': 'text/plain' });
                requestEnded = true;
                return res.end();
            })
            req.on('close', () => {
                if (requestEnded === false) {
                    res.writeHead(503, { 'Content-Type': 'text/plain' });
                    return res.end();
                }
            })
            if ((queryObject.domain && specialChars.test(queryObject.domain)) || (queryObject.lang && specialChars.test(queryObject.lang))) {
                res.writeHead(503, { 'Content-Type': 'text/plain' })
                requestEnded = true
                return res.end(JSON.stringify([]))
            }
            if (pathname === '/recommended' && req.method === 'GET') {
                res.writeHead(503, { 'Content-Type': 'text/plain' })
                requestEnded = true
                return res.end('Recommended icons')

            } else if (pathname === '/selected' && req.method === 'GET') {
                res.writeHead(503, { 'Content-Type': 'text/plain' })
                requestEnded = true
                return res.end('Selected icons ' + queryObject.lang)

            } else if (pathname === '/get' && req.method === 'GET') {
                res.writeHead(503, { 'Content-Type': 'text/plain' })
                requestEnded = true
                return res.end('Get icon ' + queryObject.domain)

            } else {
                res.writeHead(503, { 'Content-Type': 'text/plain' })
                requestEnded = true
                return res.end()
            }
        } catch (exception) {
            console.log("===================HTTP OBJECT ERROR===============")
            console.log(exception);
        }
    })

    server.on("clientError", function (err, socket) {
        console.log("Client Connection Error");
        console.log(err);
    })
    server.on("secureConnection", function (socket) {
        console.log("Secure Connection Error");
    })
    return server
}


module.exports = {
    createWebServer
}