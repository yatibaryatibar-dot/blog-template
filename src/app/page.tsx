'use client';

import { useEffect } from 'react';
import { defaultLocale } from '@/i18n/config';

export default function RootPage() {
    useEffect(() => {
        window.location.replace(`/blog-template/${defaultLocale}`);
    }, []);

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <p>正在跳转...</p>
        </div>
    );
}
