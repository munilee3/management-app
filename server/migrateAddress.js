// server/migrate_addresses.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH);

function columnExists(table, col) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows.some(r => r.name === col));
    });
  });
}

(async () => {
  try {
    const hasAddressDetails = await columnExists('addresses','address_details');
    const hasPinCode = await columnExists('addresses','pin_code');

    db.serialize(() => {
      if (!hasAddressDetails) {
        db.run("ALTER TABLE addresses ADD COLUMN address_details TEXT;", (err) => {
          if (err) console.error("Failed to add address_details:", err.message);
          else console.log("Added column: address_details");
        });
      } else console.log("Column address_details already exists");

      if (!hasPinCode) {
        db.run("ALTER TABLE addresses ADD COLUMN pin_code TEXT;", (err) => {
          if (err) console.error("Failed to add pin_code:", err.message);
          else console.log("Added column: pin_code");
        });
      } else console.log("Column pin_code already exists");

      // If you have older columns like `street` / `zip`, copy them into the new columns:
      db.run("UPDATE addresses SET address_details = street WHERE (address_details IS NULL OR address_details = '') AND (street IS NOT NULL);", (err) => {
        if (err) console.error("Error copying street->address_details:", err.message);
        else console.log("Copied street -> address_details (if present)");
      });

      db.run("UPDATE addresses SET pin_code = zip WHERE (pin_code IS NULL OR pin_code = '') AND (zip IS NOT NULL);", (err) => {
        if (err) console.error("Error copying zip->pin_code:", err.message);
        else console.log("Copied zip -> pin_code (if present)");
      });
    });

    // give the DB a moment to finish then close
    setTimeout(() => {
      db.close();
      console.log("Migration finished, DB closed");
    }, 500);
  } catch (e) {
    console.error("Migration error:", e);
    db.close();
  }
})();