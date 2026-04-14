const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const dayjs = require('dayjs');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const CACHE_DIR = path.join(process.cwd(), '.cache');
const INDEX_PATH = path.join(CACHE_DIR, 'content-index.json');

type IndexItem = {
  slug: string;
  type: 'post' | 'daily';
  filePath: string; // relative to content/
  fileName: string;
  fileNameBase: string;
  title: string | null;
  date: string | null; // YYYY-MM-DD
  tags: string[];
};

function isMarkdown(file: string): boolean {
  return file.toLowerCase().endsWith('.md');
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await fsp.mkdir(dir, { recursive: true });
  } catch { }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (e: import('fs').Dirent) => {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) return walk(res);
    return res;
  }));
  return files.flat();
}

function normalizeDate(value: string | number | Date | null | undefined): string | null {
  const d = dayjs(value);
  if (d.isValid()) return d.format('YYYY-MM-DD');
  return null;
}

async function buildIndex() {
  const allFiles = (await walk(CONTENT_DIR)).filter(isMarkdown);
  const items: IndexItem[] = [];

  for (const fullPath of allFiles) {
    const rel = path.relative(CONTENT_DIR, fullPath);
    const dir = path.dirname(rel).replace(/\\/g, '/');
    const fileName = path.basename(fullPath);
    const fileNameBase = fileName.replace(/\.md$/i, '');

    const content = await fsp.readFile(fullPath, 'utf8');
    const { data } = matter(content);

    const slug = data.slug || null;

    const topLevelDir = dir.split('/').filter(Boolean)[0] || '';
    if (!topLevelDir) {
      continue;
    }

    if (topLevelDir !== 'posts' && topLevelDir !== 'daily') {
      continue;
    }

    const type = topLevelDir === 'daily' ? 'daily' : 'post';
    const date = normalizeDate(data.date);
    const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
    const title = data.title ? String(data.title) : null;

    if (!slug) {
      continue;
    }

    items.push({
      slug,
      type,
      filePath: rel.replace(/\\/g, '/'),
      fileName,
      fileNameBase,
      title,
      date,
      tags,
    });
  }

  await ensureDir(CACHE_DIR);
  await fsp.writeFile(INDEX_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2), 'utf8');
  console.log(`Wrote index: ${INDEX_PATH} (${items.length} items)`);
}

buildIndex().catch((err) => {
  console.error('Failed to generate content index:', err);
  process.exit(1);
});

export {};
