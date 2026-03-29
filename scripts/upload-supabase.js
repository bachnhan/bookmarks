import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
// For seeding data into a private account, you should use the SERVICE_ROLE_KEY or provide a USER_ID
const USER_ID = process.env.USER_ID; 

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function upload() {
  const dataPath = './src/data.ts';
  const content = fs.readFileSync(dataPath, 'utf-8');
  
  // Extract bookmarks
  const bookmarksMatch = content.match(/export const MOCK_BOOKMARKS: Bookmark\[\] = (\[[\s\S]*?\]);\n/);
  const foldersMatch = content.match(/export const MOCK_FOLDERS: Folder\[\] = (\[[\s\S]*?\]);\n/);
  
  if (!bookmarksMatch || !foldersMatch) {
    console.error("Could not extract data from src/data.ts");
    return;
  }
  
  const bookmarks = JSON.parse(bookmarksMatch[1]);
  const folders = JSON.parse(foldersMatch[1]);
  
  console.log(`Uploading ${folders.length} folders...`);
  const dbFolders = folders.map(f => ({
    name: f.name,
    description: f.description,
    itemcount: f.itemCount,
    iconname: f.iconName,
    bgimageurl: f.bgImageUrl || null,
    user_id: USER_ID // Associate with user if provided
  }));
  
  const { error: foldersErr } = await supabase.from('folders').insert(dbFolders);
  if (foldersErr) {
    console.error("Folders upload error:", foldersErr);
    return;
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
    addedat: b.addedAt,
    type: b.type,
    user_id: USER_ID // Associate with user if provided
  }));
  
  const { error: errorBookmarks } = await supabase.from('bookmarks').insert(dbBookmarks);
  if (errorBookmarks) {
    console.error("Bookmarks upload error:", errorBookmarks);
  } else {
    console.log("Upload complete!");
  }
}

upload();
