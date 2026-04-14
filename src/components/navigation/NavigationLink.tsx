import Link from "next/link";
import { defaultLocale, Locale } from '@/i18n/config';
import { ExternalLinkIcon } from '@/components/ui';
import { getLocalePath } from '@/lib/utils';

interface NavigationLinkProps {
    href: string;
    label: string;
    pathname: string;
    lang: Locale;
    isMobile?: boolean;
    isExternal?: boolean;
}

export default function NavigationLink({
    href,
    label,
    pathname,
    lang,
    isMobile = false,
    isExternal = false
}: NavigationLinkProps) {
    const normalize = (value: string) => {
        if (value === '/') return '/';
        return value.endsWith('/') ? value.slice(0, -1) : value;
    };

    const stripDefaultLocalePrefix = (value: string) => {
        if (!value) return '/';
        if (value === '/' || value === `/${defaultLocale}`) {
            return '/';
        }
        const prefix = `/${defaultLocale}`;
        if (value.startsWith(prefix + '/')) {
            return value.slice(prefix.length);
        }
        return value;
    };

    const normalizedPathname = normalize(stripDefaultLocalePrefix(pathname || '/'));
    const normalizedHref = normalize(stripDefaultLocalePrefix(href));

    let isActive = false;
    if (!isExternal) {
        const homePath = getLocalePath(lang);
        const isLocaleHomePage = normalizedHref === normalize(homePath);

        if (isLocaleHomePage) {
            isActive = normalizedPathname === normalize(homePath);
        } else {
            isActive = normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
        }
    }

    const commonClasses = "transition-colors font-medium no-underline";
    const activeClass = "text-foreground font-semibold";
    const inactiveClass = "text-foreground/80 hover:text-foreground";
    const linkClasses = `${commonClasses} ${isActive ? activeClass : inactiveClass}`;

    if (isMobile) {
        return (
            <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`block px-3 py-2 rounded-md text-base ${linkClasses} ${isExternal ? 'flex items-center gap-1' : ''}`}
            >
                {label}
                {isExternal && <ExternalLinkIcon />}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`relative py-1 ${linkClasses} ${isExternal ? 'flex items-center gap-1' : ''}`}
        >
            {label}
            {isExternal && <ExternalLinkIcon />}
            {isActive && !isExternal && (
                <span className="absolute bottom-[-2px] left-0 h-0.5 w-full bg-foreground/80 rounded-full transition-all"></span>
            )}
        </Link>
    );
} 
