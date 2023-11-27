const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
require('dotenv').config();

const fileLocation = "data/";
const fileName = `host10m.csv.gz`;
const csvName = "host10m.csv";
const jsonName = "website-list.json";

function getTopLists(url) {
    const fileContent = fs.createWriteStream(fileLocation + fileName);

    https.get(url, function (response) {
        response.pipe(fileContent);

        fileContent.on("finish", () => {
            fileContent.close();
            console.log("Download Completed");
            //once downloaded upzip the file
            unzipFile();
        });
    }).on("error", function (err) {
        console.log(err.message);
    })
}

function unzipFile() {
    const fileContent = fs.createReadStream(fileLocation + fileName);
    const writeStream = fs.createWriteStream(fileLocation + csvName);
    const unzip = zlib.createGunzip();

    fileContent.pipe(unzip).pipe(writeStream)

    writeStream.on("finish", () => {
        console.log("Unzip Completed");
        //once unziped convert the file to .json
        convertCSVtoJSON();
    })
    writeStream.on("error", (err) => {
        console.log(err.message)
    })
}

function convertCSVtoJSON() {
    try {
        const csv = fs.readFileSync(fileLocation + csvName);
        const array = csv.toString().split("\n");
        const result = array.map(el => {
            const [domain, position] = el.split(',')
            return {
                domain,
                position
            }
        })
        let json = JSON.stringify(result.slice(0, process.env.LIST_LENGTH));
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data')
        }
        fs.writeFileSync('data/' + jsonName, json);
        console.log("Converted to JSON");
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    getTopLists,
    convertCSVtoJSON
};