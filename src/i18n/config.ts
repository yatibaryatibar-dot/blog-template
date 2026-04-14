// Этот файл содержит конфигурацию i18n, безопасную для использования как на клиенте, так и на сервере.

export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'zh';

export type Locale = (typeof locales)[number];

// 类型定义，用于我们的翻译字典
export type Dictionary = Record<string, string>; 