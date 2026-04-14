import AboutContent from './components/AboutContent';
import { getDictionary } from "@/i18n";
import { locales, type Locale } from "@/i18n/config";

export const revalidate = 300;

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
    return locales.map((lang) => ({ lang }));
}

export default async function AboutPage({ params }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(params.lang);

    const pageTitle = dictionary['about.title'] || "About";
    const pageDescription = dictionary['about.description'] || "Information about this site or its author.";

    return (
        <div className="main-container py-24">
            <div className="mb-16">
                <h1 className="text-3xl font-semibold mb-4">{pageTitle}</h1>
                <p className="text-muted-foreground">{pageDescription}</p>
            </div>

            <div className="prose prose-base max-w-none">
                <AboutContent lang={params.lang} />
            </div>
        </div>
    );
}