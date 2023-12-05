const { parentPort } = require('worker_threads');
const imageDataURI = require('image-data-uri');
const { getDomainIcon } = require('../db-commands/helpers');

parentPort.on('message', (data) => {
    parentPort.postMessage(encode(data.buffer, data.domain, data.size))
})

function encode(buffer, domain, size) {
    let dataUri = imageDataURI.encode(buffer, 'PNG')
    getDomainIcon(domain).then(icons => {
        for(let el of icons){
            if(el.dataUri === dataUri){
                dataUri = null
            }
        }
    })
    return {
        size,
        dataUri
    }
}