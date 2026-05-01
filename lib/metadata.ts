// 1. 基础配置
export const siteConfig = {
    baseUrl: 'https://connectthedotsprintable.online',
    locales: ['en', 'de', 'es', 'pt', 'fr', 'it', 'nl'],
    defaultLocale: 'en',
};

// 2. 核心工具函数：生成 alternates
export function getAlternates(locale: string, path: string = '') {
    const { baseUrl, locales, defaultLocale } = siteConfig;

    // 格式化 path：确保以 / 开头且以 / 结尾（符合 trailingSlash: true）
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedPath = cleanPath === '/' ? '/' : (cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`);

    // 构造不同语言的链接
    const languages: Record<string, string> = {};
    locales.forEach((l) => {
        // 英语是根目录，其他语言带前缀
        const prefix = l === defaultLocale ? '' : `/${l}`;
        languages[l] = `${baseUrl}${prefix}${normalizedPath}`;
    });

    // 添加 x-default (SEO 必备)
    languages['x-default'] = `${baseUrl}${normalizedPath}`;

    return {
        // 规范链接指向当前页面自己（例如 /de/about/）
        canonical: `${baseUrl}${locale === defaultLocale ? '' : `/${locale}`}${normalizedPath}`,
        languages: languages,
    };
}

export function getUrl(locale: string, path: string = '') {
    const { baseUrl, locales, defaultLocale } = siteConfig;

    // 格式化 path：确保以 / 开头且以 / 结尾（符合 trailingSlash: true）
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedPath = cleanPath === '/' ? '/' : (cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`);


    return `${baseUrl}${locale === defaultLocale ? '' : `/${locale}`}${normalizedPath}`
}