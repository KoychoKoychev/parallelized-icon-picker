const fs = require('fs');

function indexList(list) {
    const result = list.reduce((total, current) => Object.assign(total, { [current.domain]: current }), {})
    // const json = JSON.stringify(result)
    // fs.writeFileSync('data/website-list-indexed.json', json);
    return result
}

module.exports = {
    indexList
}