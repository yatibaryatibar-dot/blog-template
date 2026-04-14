import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { IndexEntry } from '@/types/content';

const contentRoot = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentRoot, 'posts');
const dailyDirectory = path.join(contentRoot, 'daily');
const indexPath = path.join(process.cwd(), '.cache', 'content-index.json');

export async function loadContentIndex(): Promise<IndexEntry[]> {
  try {
    const buf = await fs.readFile(indexPath, 'utf8');
    const parsed = JSON.parse(buf);
    if (parsed && Array.isArray(parsed.items)) {
      return parsed.items as IndexEntry[];
    }
  } catch {}

  try {
    const dirs = [
      { dir: postsDirectory, type: 'post' as const },
      { dir: dailyDirectory, type: 'daily' as const },
    ];
    const results: IndexEntry[] = [];

    for (const { dir, type } of dirs) {
      const names = await fs.readdir(dir);
      for (const name of names) {
        const full = path.join(dir, name);
        const stat = await fs.stat(full);
        if (stat.isDirectory() || !name.endsWith('.md')) continue;
        const rel = path.relative(contentRoot, full);
        const { data } = matter(await fs.readFile(full, 'utf8'));
        if (!data.slug) continue;
        results.push({
          slug: String(data.slug),
          type,
          filePath: rel,
          fileName: name,
          fileNameBase: name.replace(/\.md$/i, ''),
          title: data.title ? String(data.title) : null,
          date: typeof data.date === 'string' ? data.date : null,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Failed to load content index:', error);
    return [];
  }
}

export async function readContentPage(relativePath: string): Promise<string> {
  return fs.readFile(path.join(contentRoot, relativePath), 'utf8');
}

export function resolveContentPath(entry: IndexEntry): string {
  return path.join(contentRoot, entry.filePath);
}
