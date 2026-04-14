import React from 'react';
import { PostData } from '@/content/queries/posts';
import path from 'path';
import MDXContent from '@/components/ui/MDXContent';
import Link from 'next/link';
import { Locale, Dictionary } from '@/i18n/config';
import { getPostIdMap } from '@/content/queries/posts';
import { formatDateByLocale, getLocalePath } from '@/lib/utils';

interface PostDetailProps {
    post: PostData;
    lang: Locale;
    dictionary: Dictionary;
}

export default async function PostDetail({ post, lang, dictionary }: PostDetailProps) {

    const backToHomeText = dictionary['post.backToHome'] || "← 返回首页";
    const homePath = getLocalePath(lang);

    return (
        <div className="main-container py-12">
            <article>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">
                        {post.title || path.basename(post.fileName, '.md')}
                    </h1>
                    <div className="text-sm text-gray-600">
                        {formatDateByLocale(post.date, lang)}
                    </div>
                </header>
                <MDXContent content={post.content} postIdMap={await getPostIdMap()} lang={lang} />
            </article>

            <footer className="mt-12 pt-8">
                <Link href={homePath} className="text-gray-600 hover:text-gray-800 transition-colors">
                    {backToHomeText}
                </Link>
            </footer>
        </div>
    );
} 
