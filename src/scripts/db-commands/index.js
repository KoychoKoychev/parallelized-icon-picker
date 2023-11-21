const fs = require("fs");
const sqlite3 = require('sqlite3').verbose()

const filepath = 'data/icons.db'

function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath);
    } else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            try {
                createTable(db);
            } catch (err) {
                console.log('table exists');
            }
        });
        console.log("Connection with SQLite has been established");
        return db;
    }

    function createTable(db) {
        db.exec(`
    CREATE TABLE icons
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain   NOT NULL,
      size   NOT NULL,
      dataUri NOT NULL
    );
  `);
    }
}

module.exports = createDbConnection();
