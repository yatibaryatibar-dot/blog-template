'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Locale, type Dictionary } from '@/i18n/config';
import { MenuIcon, CloseIcon } from '@/components/ui';
import NavigationLink from './NavigationLink';
import { getLocalePath } from '@/lib/utils';

interface NavigationProps {
    dictionary: Dictionary;
    lang: Locale;
}

export default function Navigation({ dictionary, lang }: NavigationProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // 获取的是完整路径，包括 locale, e.g. /en/about

    const navLinks = [
        { href: getLocalePath(lang), label: dictionary['navbar.home'] || "Home", id: 'home' },
        { href: getLocalePath(lang, 'daily'), label: dictionary['navbar.daily'] || "Daily", id: 'daily' },
        { href: getLocalePath(lang, 'about'), label: dictionary['navbar.about'] || "About", id: 'about' }
    ];

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
            <div className="main-container h-header flex items-center justify-between">
                <div className="hidden lg:flex items-center">
                    <NavigationLink href={navLinks[0].href} label={navLinks[0].label} pathname={pathname} lang={lang} />
                </div>
                <div className="hidden lg:flex items-center space-x-6">
                    <NavigationLink href={navLinks[1].href} label={navLinks[1].label} pathname={pathname} lang={lang} />
                    <NavigationLink href={navLinks[2].href} label={navLinks[2].label} pathname={pathname} lang={lang} />
                </div>

                <div className="lg:hidden flex items-center space-x-2">
                    <button
                        className="p-2 -mr-2 text-foreground/80 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-md"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? (dictionary['navbar.closeMenu'] || "Close main menu") : (dictionary['navbar.openMenu'] || "Open main menu")}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-md">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <NavigationLink key={link.id} href={link.href} label={link.label} pathname={pathname} lang={lang} isMobile />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
} 
