'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Locale, locales } from '@/i18n/config'
import type { Dictionary } from '@/i18n/config';
import { getLocalePath } from '@/lib/utils';

interface LanguageSwitcherProps {
    currentLocale: Locale;
    dictionary: Dictionary;
}

export default function LanguageSwitcher({ currentLocale, dictionary }: LanguageSwitcherProps) {
    const pathname = usePathname() // e.g., /en/blog/my-post or /zh/about

    function getLocalizedPath(locale: Locale): string {
        if (!pathname) {
            return getLocalePath(locale);
        }

        const segments = pathname.split('/');
        const [, firstSegment, ...rest] = segments;

        let remainingSegments = rest;
        if (locales.includes(firstSegment as Locale)) {
            remainingSegments = rest;
        } else {
            remainingSegments = [firstSegment, ...rest].filter(Boolean);
        }

        const remainingPath = remainingSegments.join('/');
        return getLocalePath(locale, remainingPath);
    }

    // Determine the target locale for the button
    const targetLocale = currentLocale === 'en' ? 'zh' : 'en';
    const targetLocaleLabel = targetLocale === 'en' ? (dictionary['language.en'] || 'EN') : (dictionary['language.zh'] || 'ZH');

    return (
        <div className="flex items-center text-sm">
            <Link
                key={targetLocale}
                href={getLocalizedPath(targetLocale)}
                className="text-foreground/80 hover:text-foreground transition-colors no-underline font-medium"
                aria-label={dictionary[`language.switchTo.${targetLocale}`] || `Switch to ${targetLocale.toUpperCase()}`}
            >
                {targetLocaleLabel}
            </Link>
        </div>
    )
} 
