import type { MetadataRoute } from 'next';
import { getLocaleUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return [
        {
            url: getLocaleUrl('zh'),
            lastModified,
        },
        {
            url: getLocaleUrl('en'),
            lastModified,
        },
    ];
}
