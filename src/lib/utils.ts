import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { defaultLocale, type Locale } from '@/i18n/config'
import siteConfig from '@/config/site'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatDateByLocale(date: Date, locale: Locale): string {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-US'
  return new Intl.DateTimeFormat(loc, {
    year: 'numeric',
    month: locale === 'zh' ? '2-digit' : 'long',
    day: '2-digit',
  }).format(date)
}

const DEFAULT_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain).replace(/\/+$/, '');

function normalizeSegment(segment: string): string {
  if (!segment || segment === '/') {
    return '';
  }
  return segment.startsWith('/') ? segment : `/${segment}`;
}

export function getLocalePath(locale: Locale, segment = ''): string {
  const normalizedSegment = normalizeSegment(segment);

  if (locale === defaultLocale) {
    return normalizedSegment || '/';
  }

  return `/${locale}${normalizedSegment}`;
}

export function getLocaleUrl(locale: Locale, segment = ''): string {
  const path = getLocalePath(locale, segment);
  return path === '/' ? `${DEFAULT_SITE_URL}/` : `${DEFAULT_SITE_URL}${path}`;
}

export function getHtmlLang(locale: Locale): string {
  if (locale === 'zh') {
    return 'zh-CN';
  }
  return 'en';
}
