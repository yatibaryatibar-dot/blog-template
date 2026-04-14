import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { defaultLocale } from '@/i18n/config';
import { getHtmlLang } from '@/lib/utils';
import siteConfig from '@/config/site';

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.domain),
};

export default function RootLayout({ children }: { children: ReactNode }) {
    const htmlLang = getHtmlLang(defaultLocale);

    return (
        <html lang={htmlLang}>
            <body className="antialiased min-h-screen flex flex-col bg-background font-sans">
                {children}
            </body>
        </html>
    );
}
