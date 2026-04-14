import React from 'react';
import { Locale, type Dictionary } from '@/i18n/config';
import Navigation from '@/components/navigation/Navigation';

interface MainLayoutProps {
    children: React.ReactNode;
    dictionary: Dictionary;
    lang: Locale;
}

export default function MainLayout({ children, dictionary, lang }: MainLayoutProps) {
    return (
        <>
            <Navigation dictionary={dictionary} lang={lang} />
            <main className="w-full flex-1 pt-header pb-12 sm:pb-16">
                {children}
            </main>
            {/* Optional Footer can be added here */}
        </>
    );
} 
