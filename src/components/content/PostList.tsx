import React from 'react';
import Link from "next/link"
import path from 'path';
import { formatDateByLocale } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { PostSummary } from '@/content/queries/posts';

interface PostListProps {
    posts: PostSummary[];
    baseUrl: string;
    header?: React.ReactNode;
    lang?: Locale;
}

export default function PostList({ posts, baseUrl, header, lang = 'zh' }: PostListProps) {
    const postsByYear = posts.reduce((acc, post) => {
        const year = post.date ? post.date.getFullYear().toString() : '未知年份';
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {} as Record<string, PostSummary[]>);

    // 对每年的文章列表进行排序
    Object.values(postsByYear).forEach(posts => {
        posts.sort((a, b) => {
            if (a.date && b.date) {
                return b.date.getTime() - a.date.getTime();
            }
            return 0;
        });
    });

    // 对年份进行降序排序
    const sortedYears = Object.keys(postsByYear).sort((a, b) => {
        if (a === '未知年份') return 1;
        if (b === '未知年份') return -1;
        return parseInt(b) - parseInt(a);
    });

    return (
        <div className="main-container py-10 sm:py-14">
            {header}
            <div className="space-y-20">
                {sortedYears.map((year) => (
                    <section key={year} className="group">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 pb-1 border-b text-foreground/80 transition-colors">
                            {year}
                        </h2>
                        <ul className="space-y-2 sm:space-y-1">
                            {postsByYear[year].map((post) => (
                                <li key={post.slug} className="group/item">
                                    <Link
                                        href={`${baseUrl}/${post.slug}`}
                                        className="block sm:flex sm:justify-between sm:items-baseline py-1.5 sm:py-1 rounded-md transition-colors group-hover/item:text-primary"
                                    >
                                        <h3 className="text-base font-medium text-gray-600 transition-colors mb-1 sm:mb-0">
                                            {path.basename(post.fileName, '.md')}
                                        </h3>
                                        <time className="text-sm text-muted-foreground sm:whitespace-nowrap sm:pl-4 sm:flex-shrink-0 sm:w-[8rem] sm:text-right font-mono">
                                            {post.date ? formatDateByLocale(post.date, lang) : '未知日期'}
                                        </time>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
} 
