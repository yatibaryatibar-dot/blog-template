import { getSortedPostsData } from "@/content/queries/posts"
import { PostList } from "@/components/content"
import { getDictionary } from "@/i18n";
import { locales, type Locale } from "@/i18n/config";
import { getLocalePath } from '@/lib/utils';
import siteConfig from '@/config/site';

export const revalidate = 300;

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
    return locales.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(params.lang);
    const allPostsData = await getSortedPostsData();
    const pageTitle = dictionary['home.title'] || siteConfig.title;
    const pageDescription = dictionary['home.description'] || siteConfig.description;

    const header = (
        <div className="mb-16">
            <h1 className="text-3xl font-semibold mb-4">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
        </div>
    );

    return <PostList posts={allPostsData} baseUrl={getLocalePath(params.lang, 'posts')} header={header} lang={params.lang} />;
}