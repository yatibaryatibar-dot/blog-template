import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import { loadContentIndex, resolveContentPath } from '@/content/loaders/markdown';
import { parseContentDate } from '@/content/transforms/date';
import type { IndexEntry, PostData, PostSummary } from '@/types/content';

// 添加缓存
let postsCache: PostSummary[] | null = null;
let dailyCache: PostSummary[] | null = null;
let slugMapCache: Map<string, IndexEntry> | null = null;
let postIdMapCache: Record<string, string> | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function loadSlugMap(): Promise<Map<string, IndexEntry>> {
  if (slugMapCache && Date.now() - lastCacheTime < CACHE_DURATION) return slugMapCache
  const index = await loadContentIndex()
  slugMapCache = new Map(index.map((it) => [it.slug, it]))
  lastCacheTime = Date.now()
  // 也刷新 postIdMap 缓存
  postIdMapCache = Object.fromEntries(index.map((it) => [it.fileNameBase, it.slug]))
  return slugMapCache
}

export async function getPostIdMap(): Promise<Record<string, string>> {
  if (postIdMapCache && Date.now() - lastCacheTime < CACHE_DURATION) return postIdMapCache
  await loadSlugMap()
  return postIdMapCache || {}
}

export async function getSortedPostsData(): Promise<PostSummary[]> {
  const now = Date.now();
  if (postsCache && (now - lastCacheTime < CACHE_DURATION)) return postsCache
  try {
    const index = await loadContentIndex()
    const posts = index.filter((it) => it.type === 'post')
    const summaries: PostSummary[] = posts.map((it) => ({
      slug: it.slug,
      fileName: it.fileName,
      description: '',
      keywords: [],
      date: parseContentDate(it.date, it.fileName),
      tags: it.tags.map((t) => t.toLowerCase()),
    }))
    summaries.sort((a, b) => b.date.getTime() - a.date.getTime())
    postsCache = summaries
    lastCacheTime = now
    return summaries
  } catch (error) {
    console.error('Error loading posts index:', error)
    return []
  }
}

export async function getDailyPostsData(): Promise<PostSummary[]> {
  const now = Date.now();
  if (dailyCache && (now - lastCacheTime < CACHE_DURATION)) return dailyCache
  try {
    const index = await loadContentIndex()
    const posts = index.filter((it) => it.type === 'daily')
    const summaries: PostSummary[] = posts.map((it) => ({
      slug: it.slug,
      fileName: it.fileName,
      description: '',
      keywords: [],
      date: parseContentDate(it.date, it.fileName),
      tags: it.tags.map((t) => t.toLowerCase()),
    }))
    summaries.sort((a, b) => b.date.getTime() - a.date.getTime())
    dailyCache = summaries
    lastCacheTime = now
    return summaries
  } catch (error) {
    console.error('Error loading daily index:', error)
    return []
  }
}

export async function getAllPostSlugs(): Promise<{ params: { slug: string } }[]> {
  try {
    const index = await loadContentIndex()
    return index.filter((it) => it.type === 'post').map((it) => ({ params: { slug: it.slug } }))
  } catch (error) {
    console.error('Error getting all post slugs:', error)
    return []
  }
}

export async function getAllDailySlugs(): Promise<{ params: { slug: string } }[]> {
  try {
    const index = await loadContentIndex()
    return index.filter((it) => it.type === 'daily').map((it) => ({ params: { slug: it.slug } }))
  } catch (error) {
    console.error('Error getting all daily slugs:', error)
    return []
  }
}

async function findPostBySlug(slug: string): Promise<{ directory: string, fileName: string } | null> {
  const slugMap = await loadSlugMap()
  const entry = slugMap.get(slug)
  if (!entry) return null
  const abs = resolveContentPath(entry)
  return { directory: path.dirname(abs), fileName: path.basename(abs) }
}


export async function getPostData(slug: string): Promise<PostData | null> {
  const fileLocation = await findPostBySlug(slug);

  if (!fileLocation) {
    return null;
  }

  const { directory, fileName } = fileLocation;
  const fullPath = path.join(directory, fileName);

  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const currentSlug = matterResult.data.slug;

    if (!currentSlug || currentSlug !== slug) {
      console.warn(`Slug mismatch or missing in ${fileName} after finding it. Expected: ${slug}, Found: ${currentSlug}`);
      return null;
    }

    const description = matterResult.data.description || '';
    const keywords = Array.isArray(matterResult.data.keywords)
      ? matterResult.data.keywords.map(String)
      : typeof matterResult.data.keywords === 'string'
        ? matterResult.data.keywords.split(',').map(k => k.trim()).filter(k => k)
        : [];

    const postDate = parseContentDate(matterResult.data.date, fileName);

    return {
      slug,
      fileName,
      description,
      keywords,
      content: matterResult.content,
      date: postDate,
      tags: Array.isArray(matterResult.data.tags)
        ? matterResult.data.tags.map(tag => String(tag).toLowerCase())
        : [],
    };
  } catch (error) {
    console.error(`Error reading post data for ${fileName} (slug: ${slug}):`, error);
    return null;
  }
}

export type { PostSummary, PostData } from '@/types/content'
