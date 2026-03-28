require('dotenv').config();
const db = require('./config/db');

async function migrate() {
  try {
    // Attempt to add the column. 
    // If it already exists, MySQL will throw an error, which we simply catch and ignore safely.
    await db.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL');
    console.log("Phone column added successfully!");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Phone column already exists, skipping.");
    } else {
      console.error("Migration failed:", err);
      process.exit(1);
    }
  }
  process.exit(0);
}

migrate();
