import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const USER_ID = process.env.USER_ID; 

console.log("Using URL:", SUPABASE_URL);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function upload() {
  const dataPath = './src/data.ts';
  const content = fs.readFileSync(dataPath, 'utf-8');
  
  // Extract bookmarks and folders
  const foldersMatch = content.match(/export const MOCK_FOLDERS: Folder\[\] = (\[[\s\S]*?\]);/);
  const bookmarksMatch = content.match(/export const MOCK_BOOKMARKS: Bookmark\[\] = (\[[\s\S]*?\]);/);
  
  if (!bookmarksMatch || !foldersMatch) {
    console.error("Could not extract data from src/data.ts");
    return;
  }
  
  // Use a safer way to parse the content instead of eval if possible, 
  // but for simple mock data eval or new Function is fine.
  const folders = new Function(`return ${foldersMatch[1]}`)();
  const bookmarks = new Function(`return ${bookmarksMatch[1]}`)();
  
  console.log("Cleaning up existing data...");
  const deleteQuery = USER_ID ? { user_id: USER_ID } : {};
  
  // Delete bookmarks first due to foreign key constraints if any
  await supabase.from('bookmarks').delete().match(deleteQuery);
  await supabase.from('folders').delete().match(deleteQuery);

  console.log(`Uploading ${folders.length} folders...`);
  const folderMap = {};
  
  for (const f of folders) {
    const { data, error } = await supabase.from('folders').insert({
      name: f.name,
      description: f.description,
      itemcount: f.itemCount,
      iconname: f.iconName,
      bgimageurl: f.bgImageUrl || null,
      user_id: USER_ID
    }).select().single();
    
    if (error) {
      console.error(`Error creating folder ${f.name}:`, error);
      continue;
    }
    folderMap[f.id] = data.id;
  }
  
  console.log(`Uploading ${bookmarks.length} bookmarks...`);
  const dbBookmarks = bookmarks.map(b => ({
    title: b.title,
    description: b.description || '',
    url: b.url,
    source: b.source,
    faviconurl: b.faviconUrl || null,
    imageurl: b.imageUrl || null,
    tags: b.tags,
    addedat: b.addedAt || new Date().toISOString(),
    type: b.type || 'medium',
    user_id: USER_ID,
    folder_id: b.folder_id ? folderMap[b.folder_id] : null
  }));
  
  const { error: errorBookmarks } = await supabase.from('bookmarks').insert(dbBookmarks);
  if (errorBookmarks) {
    console.error("Bookmarks upload error:", errorBookmarks);
  } else {
    console.log("Upload complete!");
  }
}

upload();
