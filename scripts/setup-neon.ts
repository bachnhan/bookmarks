import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

// Load configuration from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment variables");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

export async function createTables() {
  console.log("Setting up Neon Database tables (Fresh Start)...");

  // 1. Create folders table
  console.log("Creating folders table (if not exists)...");
  await sql`
    CREATE TABLE IF NOT EXISTS folders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      itemcount INTEGER DEFAULT 0,
      iconname TEXT,
      bgimageurl TEXT,
      parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
      sort_order INTEGER DEFAULT 0,
      user_id TEXT, 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Create bookmarks table
  console.log("Creating bookmarks table (if not exists)...");
  await sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      source TEXT,
      faviconurl TEXT,
      imageurl TEXT,
      tags TEXT[],
      addedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      type TEXT DEFAULT 'medium',
      is_starred BOOLEAN DEFAULT FALSE,
      is_archived BOOLEAN DEFAULT FALSE,
      user_id TEXT,
      folder_id UUID REFERENCES folders(id) ON DELETE SET NULL
    );
  `;
  
  console.log("Tables created successfully in Neon Database!");
}

createTables().catch(console.error);
