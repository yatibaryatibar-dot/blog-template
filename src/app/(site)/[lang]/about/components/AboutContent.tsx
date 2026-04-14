import React from 'react';
import { readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXContent } from '@/components/ui';
import { getPostIdMap } from '@/content/queries/posts';
import { type Locale } from '@/i18n/config';

export default async function AboutContent({ lang }: { lang: Locale }) {
    try {
        const aboutPath = path.join(process.cwd(), 'content', 'pages', 'about.md');
        const fileContents = await readFile(aboutPath, 'utf8');
        const { content } = matter(fileContents);

        return <MDXContent content={content} postIdMap={await getPostIdMap()} lang={lang} />;
    } catch (error) {
        console.error('Error rendering about page:', error);
        throw error;
    }
} 
