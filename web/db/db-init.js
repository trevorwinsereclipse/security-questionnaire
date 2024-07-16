// server/db/db-init.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbFilePath = './server/db/my-database.db';

if (!fs.existsSync(dbFilePath)) {
  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )`);

    // db.run(`INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')`);
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
}
