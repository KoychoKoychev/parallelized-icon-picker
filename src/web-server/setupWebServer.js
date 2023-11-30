const http = require('http');
const url = require('url');

const { sortList } = require('../scripts/list-manupulation/sortList');
const { indexList } = require('../scripts/list-manupulation/indexList');
const { aggregateList } = require('../scripts/list-manupulation/aggregateList');
const { convertCSVtoJSON } = require('../scripts/top-domain-list/fileManipulation');

function prepareWebsiteList(iconFetcher) {
    let WEBSITE_LIST_JSON
    try {
        WEBSITE_LIST_JSON = fs.readFileSync('data/website-list.json');
    } catch (err) {
        convertCSVtoJSON();
        WEBSITE_LIST_JSON = fs.readFileSync('data/website-list.json');
    }

    let WEBSITE_LIST = JSON.parse(WEBSITE_LIST_JSON);

    //it sorts the list according to the POSITION key and if there are duplicated POSITIONS, it renumbers it
    sortList(WEBSITE_LIST);
    //creates an object that has the DOMAIN name as an index
    let INDEXED_LIST = indexList(WEBSITE_LIST);
    //creates an aggregared list with keys - the 1-st 1,2,3 characters of the DOMAIN name, that include an array with the domain POSITION
    let AGGREGATED_LIST = aggregateList(WEBSITE_LIST);

    if (iconFetcher.getNormalQueueLength() === 0) {
        for (let el of WEBSITE_LIST) {
            if (getDomainFavicon(el.domain).length === 0) {
                iconFetcher.queueRequest(el)
            }
        }
    }

    return [WEBSITE_LIST, INDEXED_LIST, AGGREGATED_LIST]
}

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