require('dotenv').config();
const db = require('./config/db');

async function migrate() {
    try {
        await db.execute("ALTER TABLE results ADD COLUMN status ENUM('Pending', 'Released') DEFAULT 'Pending'");
        console.log("Migration Success: 'status' column injected into 'results' table.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("'status' column already exists in 'results'. Skipping.");
        } else {
            console.error("Migration failed:", err);
            process.exit(1);
        }
    }
    process.exit(0);
}

migrate();
