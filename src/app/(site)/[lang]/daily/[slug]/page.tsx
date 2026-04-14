import { locales, type Locale } from "@/i18n/config";
import { PostDetail } from '@/components/content';
import { getPostData, getAllDailySlugs } from '@/content/queries/posts';
import { notFound } from 'next/navigation';
import { getDictionary } from "@/i18n";
import { Metadata, ResolvingMetadata } from 'next';
import { getLocaleUrl } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ lang: Locale; slug: string }[]> {
    const slugsData = await getAllDailySlugs();
    const params: { lang: Locale; slug: string }[] = [];
    for (const lang of locales) {
        for (const item of slugsData) {
            params.push({ lang, slug: item.params.slug });
        }
    }
    return params;
}

interface DailyPostPageProps {
    params: {
        slug: string;
        lang: Locale;
    };
}

export async function generateMetadata(
    { params }: DailyPostPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post = await getPostData(params.slug);

    if (!post) {
        const previousTitle = (await parent).title?.absolute || "Daily Entry Not Found";
        return {
            title: previousTitle,
            description: "The daily entry you are looking for could not be found.",
        };
    }

    const canonicalUrl = getLocaleUrl(params.lang, `daily/${post.slug}`);

    return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: canonicalUrl,
            type: 'article',
            publishedTime: post.date.toISOString(),
            authors: [],
            tags: post.tags,
        },
    };
}

export default async function DailyPostPage({ params }: DailyPostPageProps) {
    const dictionary = await getDictionary(params.lang);

    const postData = await getPostData(params.slug /*, params.lang */);

    if (!postData) {
        notFound();
    }

    return <PostDetail post={postData} lang={params.lang} dictionary={dictionary} />;
} 
