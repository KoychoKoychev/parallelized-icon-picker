const fs = require('fs');

function sortList(list) {
    if(Array.isArray(list)){
        const sortedList = list.sort((a,b)=>a.position - b.position || a.domain.localeCompare(b.domain));
        for (let i = 0; i < sortedList.length; i++) {
        const element = sortedList[i];
        if(Number(element.position) !== i + 1){
            element.position = (i + 1).toString()
        }
    }
    // const json = JSON.stringify(sortedList);
    // fs.writeFileSync('data/website-list.json', json);
    return sortedList
    }else{
        return []
    }
}

module.exports = {
    sortList
}