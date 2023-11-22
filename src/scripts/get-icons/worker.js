const { parentPort } = require('worker_threads');
const imageDataURI = require('image-data-uri');
const { getDomainIcon } = require('../create-database/dbCommands');

parentPort.on('message', (data) => {
    parentPort.postMessage(encode(data.buffer, data.domain, data.size))
})

function encode(buffer, domain, size) {
    let dataUri = imageDataURI.encode(buffer, 'PNG')
    for(let el of getDomainIcon(domain)){
        if(el.dataUri === dataUri){
            dataUri = null
        }
    }
    return {
        size,
        dataUri
    }
}