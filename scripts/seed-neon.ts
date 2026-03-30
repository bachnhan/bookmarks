import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'node-html-parser';
import { randomUUID } from 'node:crypto';

// Load configuration from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment variables");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const CORE_FOLDERS = [
  { name: 'Projects', icon: 'briefcase', description: 'Active project resources' },
  { name: '[Docs]', icon: 'book-open', description: 'Technical documentation and APIs' },
  { name: '[Personal]', icon: 'user', description: 'Non-work-related bookmarks' },
  { name: '[Tools]', icon: 'tool', description: 'Development and productivity utilities' },
  { name: '[Daily]', icon: 'sun', description: 'Daily essentials and routines' },
];

interface ParsedFolder {
  id: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
}

interface ParsedBookmark {
  title: string;
  url: string;
  faviconurl: string | null;
  addedat: string;
  folder_id: string | null;
}

function parseBookmarksHtml(filePath: string) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const root = parse(html);
  
  const folders: ParsedFolder[] = [];
  const bookmarks: ParsedBookmark[] = [];
  
  // Use querySelectorAll to find all interesting elements in document order
  const elements = root.querySelectorAll('h3, a, dl');
  
  const folderStack: string[] = [];
  const dlToFolderMap = new Map<any, string | null>();
  
  // The first DL is the root
  const mainDl = root.querySelector('dl');
  if (!mainDl) return { folders, bookmarks };
  
  dlToFolderMap.set(mainDl, null);

  // We need to know which DL contains which element.
  // Actually, a simpler way: for each H3/A, find its parent DL.
  const allH3 = root.querySelectorAll('h3');
  const allA = root.querySelectorAll('a');

  const folderIdByH3 = new Map<any, string>();

  for (const h3 of allH3) {
    const folderId = randomUUID();
    folderIdByH3.set(h3, folderId);
    
    // Find parent DL to determine parent folder
    let parentDl = h3.parentNode;
    while (parentDl && parentDl.tagName !== 'DL') {
      parentDl = parentDl.parentNode;
    }
    
    // Find which H3 corresponds to this parentDl
    let parentFolderId: string | null = null;
    if (parentDl) {
      // The parent DL is the content of SOME folder.
      // In Netscape format, <DT><H3>Folder</H3><DL>Contents</DL>
      // So the parent DL's previous sibling (or previous DT's H3) is the owner.
      // But let's try something else: find the H3 whose following DL is this parentDl.
      
      // Actually, let's keep it simple: 
      // If parentDl is the mainDl, parentFolderId is null.
      if (parentDl !== mainDl) {
        // Find which H3's DL this is.
        // We can look "upwards" from the DL to find the H3.
        let sibling = parentDl.previousElementSibling;
        while (sibling) {
          const innerH3 = sibling.querySelector('h3') || (sibling.tagName === 'H3' ? sibling : null);
          if (innerH3) {
            parentFolderId = folderIdByH3.get(innerH3) || null;
            break;
          }
          sibling = sibling.previousElementSibling;
        }
      }
    }

    folders.push({
      id: folderId,
      name: h3.text.trim(),
      parent_id: parentFolderId,
      sort_order: 0 // We'll fix this if needed
    });
  }

  for (const a of allA) {
    let parentDl = a.parentNode;
    while (parentDl && parentDl.tagName !== 'DL') {
      parentDl = parentDl.parentNode;
    }

    let folderId: string | null = null;
    if (parentDl && parentDl !== mainDl) {
      let sibling = parentDl.previousElementSibling;
      while (sibling) {
        const innerH3 = sibling.querySelector('h3') || (sibling.tagName === 'H3' ? sibling : null);
        if (innerH3) {
          folderId = folderIdByH3.get(innerH3) || null;
          break;
        }
        sibling = sibling.previousElementSibling;
      }
    }

    bookmarks.push({
      title: a.text.trim(),
      url: a.getAttribute('href') || '',
      faviconurl: a.getAttribute('icon') || null,
      addedat: a.getAttribute('add_date') 
        ? new Date(parseInt(a.getAttribute('add_date')!) * 1000).toISOString() 
        : new Date().toISOString(),
      folder_id: folderId
    });
  }

  return { folders, bookmarks };
}

async function seed() {
  console.log("Starting Neon database seeding from HTML file...");
  const htmlFilePath = path.resolve(process.cwd(), 'bookmarks_3_30_26.html');
  
  if (!fs.existsSync(htmlFilePath)) {
    console.error(`HTML file not found: ${htmlFilePath}`);
    process.exit(1);
  }

  try {
    const { folders, bookmarks } = parseBookmarksHtml(htmlFilePath);
    console.log(`Parsed ${folders.length} folders and ${bookmarks.length} bookmarks.`);

    // 1. Clear existing data
    console.log("Purging existing data...");
    await sql`DELETE FROM bookmarks`;
    await sql`DELETE FROM folders`;

    // 2. Insert Core Folders
    const userId = process.env.SEED_USER_ID || null;
    const folderIdMap: Record<string, string> = {};
    
    console.log(`Inserting ${CORE_FOLDERS.length} core folders...`);
    let sortOrder = 0;
    for (const folder of CORE_FOLDERS) {
      const result = await sql`
        INSERT INTO folders (name, iconname, description, user_id, sort_order)
        VALUES (${folder.name}, ${folder.icon}, ${folder.description}, ${userId}, ${sortOrder++})
        RETURNING id;
      `;
      // We don't map core folders for HTML items unless needed, 
      // but let's keep them in the map if they have names that match something? 
      // Actually, we'll just let them coexist.
    }

    // 3. Insert Parsed Folders from HTML
    console.log(`Inserting ${folders.length} HTML folders...`);
    for (const folder of folders) {
      const parentId = folder.parent_id ? folderIdMap[folder.parent_id] : null;
      
      const result = await sql`
        INSERT INTO folders (name, parent_id, user_id, sort_order)
        VALUES (${folder.name}, ${parentId}, ${userId}, ${sortOrder++})
        RETURNING id;
      `;
      folderIdMap[folder.id] = result[0].id;
    }

    // 4. Insert Bookmarks
    console.log(`Inserting ${bookmarks.length} bookmarks...`);
    for (const b of bookmarks) {
      const folderId = b.folder_id ? folderIdMap[b.folder_id] : null;
      
      await sql`
        INSERT INTO bookmarks (
          title, url, faviconurl, 
          addedat, folder_id, user_id
        )
        VALUES (
          ${b.title}, ${b.url}, ${b.faviconurl}, 
          ${b.addedat}, ${folderId}, ${userId}
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

