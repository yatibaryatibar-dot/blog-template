import { PostDetail } from '@/components/content';
import { getAllPostSlugs, getPostData } from '@/content/queries/posts';
import { notFound } from 'next/navigation';
import { getDictionary } from "@/i18n";
import { locales, type Locale } from "@/i18n/config";
import { Metadata, ResolvingMetadata } from 'next';
import { getLocaleUrl } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ lang: Locale; slug: string }[]> {
    const slugsData = await getAllPostSlugs();
    const params: { lang: Locale; slug: string }[] = [];
    for (const lang of locales) {
        for (const item of slugsData) {
            params.push({ lang, slug: item.params.slug });
        }
    }
    return params;
}

interface PostPageProps {
    params: {
        slug: string;
        lang: Locale;
    };
}

export async function generateMetadata(
    { params }: PostPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post = await getPostData(params.slug);

    if (!post) {
        const previousTitle = (await parent).title?.absolute || "Post Not Found";
        return {
            title: previousTitle,
            description: "The post you are looking for could not be found.",
        };
    }
    const canonicalUrl = getLocaleUrl(params.lang, `posts/${post.slug}`);

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

export default async function PostPage({ params }: PostPageProps) {
    const dictionary = await getDictionary(params.lang);
    const postData = await getPostData(params.slug);

    if (!postData) {
        notFound();
    }
    return <PostDetail post={postData} lang={params.lang} dictionary={dictionary} />;
} 
