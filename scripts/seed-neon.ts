import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { MOCK_FOLDERS, MOCK_BOOKMARKS } from '../src/data';

// Load configuration from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment variables");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  console.log("Starting Neon database seeding...");

  try {
    // 1. Clear existing data
    console.log("Purging existing data...");
    await sql`DELETE FROM bookmarks`;
    await sql`DELETE FROM folders`;

    // 2. Insert Folders and map IDs
    console.log(`Inserting ${MOCK_FOLDERS.length} folders...`);
    const folderIdMap: Record<string, string> = {};

    // Sort folders so parents are inserted before children (optional but safer)
    const sortedFolders = [...MOCK_FOLDERS].sort((a, b) => {
      if (!a.parent_id && b.parent_id) return -1;
      if (a.parent_id && !b.parent_id) return 1;
      return 0;
    });

    for (const folder of sortedFolders) {
      const parentId = folder.parent_id ? folderIdMap[folder.parent_id] : null;
      
      const result = await sql`
        INSERT INTO folders (name, description, itemcount, iconname, bgimageurl, parent_id)
        VALUES (${folder.name}, ${folder.description}, ${folder.itemCount}, ${folder.iconName}, ${folder.bgImageUrl || null}, ${parentId})
        RETURNING id;
      `;
      folderIdMap[folder.id] = result[0].id;
    }

    // 3. Insert Bookmarks
    console.log(`Inserting ${MOCK_BOOKMARKS.length} bookmarks...`);
    for (const b of MOCK_BOOKMARKS) {
      const folderId = b.folder_id ? folderIdMap[b.folder_id] : null;
      
      await sql`
        INSERT INTO bookmarks (
          title, description, url, source, faviconurl, imageurl, 
          tags, addedat, type, folder_id, is_starred
        )
        VALUES (
          ${b.title}, ${b.description || ''}, ${b.url}, ${b.source || null}, 
          ${b.faviconUrl || null}, ${b.imageUrl || null}, 
          ${b.tags}, ${b.addedAt || new Date().toISOString()}, 
          ${b.type || 'medium'}, ${folderId}, ${b.isStarred || false}
        )
      `;
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
