const fs = require('fs');

function createListStructure() {
    //45 - hyphen - 1
    //48-57 - numbers - 10
    //97-122 - characters - 26
    const obj = {}
    for (let i = 48; i <= 122; i++) {
        if (i < 58 || (i > 96 && i < 123)) {
            const char1 = String.fromCharCode(i)
            obj[char1] = []
            for (let j = 45; j <= 122; j++) {
                if (j == 45 || (j > 47 && j < 58) || (j > 96 && j < 123)) {
                    const char2 = String.fromCharCode(j)
                    obj[char1 + char2] = []
                    for (let k = 45; k <= 122; k++) {
                        if ((k === 45 || (k > 47 && k < 58) || (k > 96 && k < 123)) && j !== 45) {
                            const char3 = String.fromCharCode(k)
                            obj[char1 + char2 + char3] = [];
                        }
                    }
                }
            }
        }
    }
    return obj
}

function aggregateList(list) {
    const AGGREGATED_OBJECT = createListStructure()

    for(let element of list){
        if(AGGREGATED_OBJECT.hasOwnProperty(element.domain.slice(0,1))){
            AGGREGATED_OBJECT[element.domain.slice(0,1)].push(element.position);
            if(AGGREGATED_OBJECT.hasOwnProperty(element.domain.slice(0,2))){
                AGGREGATED_OBJECT[element.domain.slice(0,2)].push(element.position);
                if(AGGREGATED_OBJECT.hasOwnProperty(element.domain.slice(0,3))){
                    AGGREGATED_OBJECT[element.domain.slice(0,3)].push(element.position);
                }
            }
        }
    } 
    // const json = JSON.stringify(AGGREGATED_OBJECT)
    // fs.writeFileSync('data/aggregated-list.json', json);
    return AGGREGATED_OBJECT
}

module.exports = {
    aggregateList
}