import fs from 'fs';
import path from 'path';

// Define the shape of our block data
export interface BlockData {
  id: string;
  code: string;
  createdAt: number;
}

// Ensure the data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function saveBlock(code: string): Promise<string> {
  // Generate a random ID for the block
  const id = Math.random().toString(36).substring(2, 10);
  
  const block: BlockData = {
    id,
    code,
    createdAt: Date.now()
  };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(block, null, 2), 'utf-8');

  return id;
}

export async function getBlock(id: string): Promise<BlockData | null> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as BlockData;
}
