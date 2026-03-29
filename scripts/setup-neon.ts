import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS folders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      itemcount INTEGER DEFAULT 0,
      iconname TEXT,
      bgimageurl TEXT,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

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
      user_id UUID NOT NULL,
      folder_id UUID REFERENCES folders(id) ON DELETE SET NULL
    );
  `;
  
  console.log("Tables created successfully in Neon Database!");
}

createTables().catch(console.error);
