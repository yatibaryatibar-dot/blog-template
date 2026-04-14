import type { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { getDictionary } from '@/i18n';
import { defaultLocale, type Locale } from '@/i18n/config';
import type { ReactNode } from "react";
import { getLocaleUrl } from '@/lib/utils';
import siteConfig from '@/config/site';

export async function generateMetadata(
    { params }: { params: { lang: Locale } }
): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);
    const pageTitle = dictionary['metadata.title'] || siteConfig.title;
    const pageDescription = dictionary['metadata.description'] || siteConfig.description;

    return {
        title: pageTitle,
        description: pageDescription,
        icons: {
            icon: [
                {
                    url: '/icons/icon-32.png',
                    sizes: '32x32',
                    type: 'image/png'
                },
                {
                    url: '/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                }
            ]
        },
        alternates: {
            canonical: getLocaleUrl(params.lang),
            languages: {
                en: getLocaleUrl('en'),
                zh: getLocaleUrl(defaultLocale),
                'x-default': getLocaleUrl(defaultLocale),
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: Readonly<{
    children: ReactNode;
    params: { lang: Locale };
}>) {
    const dictionary = await getDictionary(params.lang);

    return (
        <MainLayout lang={params.lang} dictionary={dictionary}>
            {children}
        </MainLayout>
    );
}
