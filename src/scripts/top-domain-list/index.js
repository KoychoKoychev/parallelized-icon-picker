const { getTopLists, convertCSVtoJSON } = require('./fileManipulation');
const fs = require('fs');

require('dotenv').config();

if(!fs.existsSync('src/scripts/get-top-website-domains/host10m.csv')){
    getTopLists(`https://host.io/rankings/download?token=${process.env.HOST_IO_TOKEN}`);
}else{
    convertCSVtoJSON()
}
