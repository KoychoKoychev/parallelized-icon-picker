
const db = require('./index.js');

function addIcon(data) {
    db.run(
        `INSERT INTO icons (domain, size, dataUri) VALUES (?, ?, ?)`,
        [data.domain, data.size, data.dataUri],
        function (error) {
            if (error) {
                console.error(error.message);
            }
            console.log(`Inserted a row with the ID: ${this.lastID}`);
        }
    );

}

function getDomainIcon(domainName) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM icons WHERE domain = ?", [domainName], (err, row) => {
            if (err) {
                reject(err.message);
            }
            row ? resolve(row) : resolve([])
        })
    })
}

function getFullDB() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM icons", (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows)
        })
    })
}

module.exports = {
    addIcon,
    getDomainIcon,
    getFullDB
}
