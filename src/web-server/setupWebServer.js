const http = require('http');
const url = require('url');
const fs = require('fs');

const { sortList } = require('../scripts/list-manupulation/sortList');
const { indexList } = require('../scripts/list-manupulation/indexList');
const { aggregateList } = require('../scripts/list-manupulation/aggregateList');
const { convertCSVtoJSON } = require('../scripts/top-domain-list/fileManipulation');
const { getDomainIcon, addIcon } = require('../scripts/db-commands/helpers');

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
            getDomainIcon(el.domain).then(icons => {
                if (icons.length === 0) iconFetcher.queueRequest(el)
            })
        }
    }

    return [WEBSITE_LIST, INDEXED_LIST, AGGREGATED_LIST]
}

function createWebServer(WEBSITE_LIST, AGGREGATED_LIST, iconFetcher, INDEXED_LIST) {
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
                let data = WEBSITE_LIST
                let limit = 20
                res.writeHead(200, { 'Content-Type': 'application/json' })
                if (queryObject.limit && Number(queryObject.limit) > 0) {
                    limit = Number(queryObject.limit)
                    data = data.slice(0, limit)
                }
                if (queryObject.domain && queryObject.domain.length > 0) {
                    let searchString = decodeURI(queryObject.domain).trim().substring(0, 3).toLowerCase();
                    if (searchString[2] === '.') {
                        searchString = decodeURI(queryObject.domain).trim().substring(0, 2).toLowerCase();
                    }
                    let positionList = AGGREGATED_LIST[searchString] ? AGGREGATED_LIST[searchString] : [];
                    data = [];
                    for (let i = 0; i < positionList.length; i++) {
                        const el = positionList[i];
                        if (el) {
                            data.push(WEBSITE_LIST[el - 1])
                        }
                    }
                    if (queryObject.domain.length >= 3) {
                        data = data.filter(el => el.domain.includes(decodeURI(queryObject.domain).trim().toLowerCase()))
                    }
                    if (limit) {
                        data = data.slice(0, limit)
                    }
                }
                if (limit) {
                    data = data.slice(0, limit)
                }
                let outputPromises = []
                for (let el of data) {
                    outputPromises.push(iconFetcher.prioritizeRequest(el)
                        .then((domainIconsList) => {
                            let iconObject = {}
                            for (let icon of domainIconsList) {
                                iconObject = Object.assign(iconObject, { [`icon-${icon.size}`]: icon.dataUri })
                            }
                            return Object.assign(el, iconObject)
                        })
                    )
                }
                iconFetcher.processQueues();
                let result
                Promise.all(outputPromises)
                    .then((data) => {
                        requestEnded = true
                        result = data
                        res.end(JSON.stringify(data))
                    }).then(async () => {
                        try {
                            for (let el of result) {
                                if ((await getDomainIcon(el.domain)).length === 0) {
                                    for (let icon of Object.entries(el).filter(([key, value]) => key.includes('icon'))) {
                                        addIcon({
                                            domain: el.domain,
                                            size: (icon[0].split('-'))[1],
                                            dataUri: icon[1]
                                        })
                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err.name, ': ', err.message)
                        }
                    }).catch((err)=>{
                        console.log(err);
                    })
            } else if (pathname === '/get' && req.method === 'GET') {
                let domain = queryObject.domain
                let output = {
                    domain
                }

                let websiteObj = INDEXED_LIST[domain]
                if (websiteObj) {
                    output = websiteObj
                }
                let result
                iconFetcher.prioritizeRequest(output)
                    .then((domainIconsList) => {
                        if (domainIconsList.filter(el => el.dataUri !== null).length === 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            requestEnded = true
                            res.end(JSON.stringify(false))
                        } else {
                            let iconObject = {}
                            for (let icon of domainIconsList) {
                                iconObject = Object.assign(iconObject, { [`icon-${icon.size}`]: icon.dataUri })
                            }
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            requestEnded = true
                            result = Object.assign(output, iconObject)
                            res.end(JSON.stringify(Object.assign(output, iconObject)))
                        }
                    }).then(async () => {
                        try {
                            if ((await getDomainIcon(result.domain)).length === 0) {
                                for (let icon of Object.entries(result).filter(([key, value]) => key.includes('icon'))) {
                                    addIcon({
                                        domain: result.domain,
                                        size: (icon[0].split('-'))[1],
                                        dataUri: icon[1]
                                    })
                                }
                            }
                        } catch (err) {
                            console.log(err.name, ': ', err.message)
                        }
                    }).catch((err)=>{
                        console.log(err);
                    })

                iconFetcher.processQueues();

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
    prepareWebsiteList,
    createWebServer
}