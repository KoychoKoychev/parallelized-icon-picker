const https = require('https');
const os = require('os')
const path = require('path');

const { getDomainIcon } = require('../db-commands/helpers');
const WorkerPool = require('./worker-pool.js');

const interval = 100 //set interval[ms] between every (requiredSize.length) API requests
const requiredSizes = ['16', '128']

function createIconFetcher() {

    const pool = new WorkerPool(Math.ceil(os.cpus().length / 2), path.resolve(__dirname, 'worker.js'))

    let normalQueue = []
    let priorityQueue = []
    let PriorityTimeoutId = null
    let RegularTimeoutId = null
    let timeoutDuration = interval;

    function queueRequest(request) {
        return new Promise((resolve) => {
            if (request.resolve) {
                let oldResolve = request.resolve

                request.resolve = (response) => {
                    oldResolve(response)
                    resolve(response)
                }
            } else {
                request.resolve = resolve
            }

            normalQueue.push(request)
        })
    }

    function prioritizeRequest(request) {
        return new Promise((resolve) => {
            if (request.resolve) {
                let oldResolve = request.resolve

                request.resolve = (response) => {
                    oldResolve(response)
                    resolve(response)
                }
            } else {
                request.resolve = resolve
            }

            priorityQueue.push(request)
            if (normalQueue.find(el => el.domain === request.domain)) {
                normalQueue = normalQueue.filter(el => el.domain !== request.domain)
            }
        })
    }

    async function handleRequest(request) {

        let faviconPromises = []

        for (let j = 0; j < requiredSizes.length; j++) {
            let size = requiredSizes[j]
            let sendRequest = true;
            let resolvePromise
            faviconPromises.push(new Promise((resolve) => {
                resolvePromise = resolve
            }))
            if (await getDomainIcon(request.domain)) {
                sendRequest === false; //CHECK IF THERE IS ALREADY A RESULT FOR THIS DOMAIN IN THE DB AND DONT SEND REQUEST TO THE GOOGLE API IN THAT CASE
            }
            let dbDataUri
            if ((await getDomainIcon(request.domain)).find(el => el.size == size)) {
                dbDataUri = (await getDomainIcon(request.domain)).find(el => el.size == size).dataUri
            } else {
                dbDataUri = null
            }
            if (dbDataUri === null && sendRequest === true) {
                timeoutDuration = interval;
                https.get(`https://www.google.com/s2/favicons?domain=${request.domain}&sz=${size}`, (res) => {
                    let data = []
                    if (res.statusCode === 301 || res.statusCode === 302) {
                        https.get(res.headers.location, (res) => {
                            if (res.statusCode === 200) {
                                res.on('data', function (chunk) {
                                    data.push(chunk);
                                })
                                res.on('end', async function () {
                                    const buffer = Buffer.concat(data)
                                    await new Promise((resolve, reject) => {
                                        pool.runTask({ buffer, domain: request.domain, size }, (err, result) => {
                                            if (err) return reject(err)
                                            resolvePromise(result)
                                            return resolve(result)
                                        })
                                    })
                                })
                            } else {
                                resolvePromise({ size, dataUri: null })
                            }
                        })
                    } else {
                        res.on('data', function (chunk) {
                            data.push(chunk);
                        })
                        res.on('end', async function () {
                            const buffer = Buffer.concat(data)
                            await new Promise((resolve, reject) => {
                                pool.runTask({ buffer, domain: request.domain, size }, (err, result) => {
                                    if (err) return reject(err)
                                    resolvePromise(result)
                                    return resolve(result)
                                })
                            })
                        })
                    }
                })
            } else {
                timeoutDuration = 0;
                resolvePromise({ size, dataUri: dbDataUri })
            }
        }
        return Promise.allSettled(faviconPromises)
            .then((icons) => {
                request.resolve(icons.map(el => el.value))
            }).catch((err) => {
                console.log(err)
            })
    }

    async function processQueues() {
        try {
            if (priorityQueue.length > 0) {
                const el = priorityQueue.shift();
                await handleRequest(el)
                if (priorityQueue.length >= 0) {
                    PriorityTimeoutId = setTimeout(() => {
                        processQueues()
                    }, timeoutDuration)
                }
            } else if (normalQueue.length > 0) {
                const el = normalQueue.shift();
                await handleRequest(el)
                if (normalQueue.length >= 0) {
                    RegularTimeoutId = setTimeout(() => {
                        processQueues()
                    }, timeoutDuration)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    function getNormalQueueLength() {
        return normalQueue.length;
    }

    function stopQueueProgress() {
        clearTimeout(PriorityTimeoutId)
        clearTimeout(RegularTimeoutId)
    }

    return {
        queueRequest,
        prioritizeRequest,
        processQueues,
        getNormalQueueLength,
        stopQueueProgress
    }
}

module.exports = {
    createIconFetcher
}
