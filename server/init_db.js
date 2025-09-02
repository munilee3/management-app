const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "database.db");
const db = new Database(DB_PATH);

// Initialize tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    address_details TEXT,
    city TEXT,
    state TEXT,
    pin_code TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )
`).run();

console.log("Database initialized at", DB_PATH);

// ✅ Export helpers
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return { id: result.lastInsertRowid, changes: result.changes };
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

module.exports = { run, get, all, db };