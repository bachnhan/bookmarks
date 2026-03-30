const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Starting migration...');
  try {
    await sql`ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;`;
    console.log('Column is_archived added successfully.');
  } catch (error) {
    if (error.code === '42701') {
      console.log('Column is_archived already exists.');
    } else {
      console.error('Migration failed:', error);
    }
  }
}

migrate();
