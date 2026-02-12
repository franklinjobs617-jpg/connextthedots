import { MetadataRoute } from 'next';
import { getAllPrintables } from '@/lib/printables-data'; // 确保你的数据源路径正确

const baseUrl = 'https://connectthedotsprintable.online';
const locales = ['en', 'es', 'de'];

/**
 * 辅助函数，确保路径有尾部斜杠
 * @param path 路径
 * @returns 带斜杠的路径
 */
const ensureTrailingSlash = (path: string) => {
    if (path === '/') return '/'; // 根路径特殊处理
    return path.endsWith('/') ? path : `${path}/`;
};

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. 静态页面
    const staticPages = [
        '/',          // 首页
        '/pricing',
        "/printable-connect-the-dots",
        '/how-to-make',
        "/christmas-printables",
        "/free-animal-dot-to-dot-printables-pdf",
        "/popular-character-dot-to-dot-printable-worksheets",
        "/printables/adults",
        "/printables/animals",
        "/printables/christmas",
        "/printables/core",
        "/printables/general",
        "/printables/hard",
        "/printables/connectTheDotsGenerator",
        '/privacy',
        '/terms',
    ];

    const staticUrls = staticPages.map(path => {
        // 1. 确保路径以 / 结尾
        const cleanPath = ensureTrailingSlash(path);

        return {
            // 2. 拼接 URL：baseUrl + cleanPath
            // 结果示例: https://site.com/ 或 https://site.com/pricing/
            url: `${baseUrl}${cleanPath}`,

            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: path === '/' ? 1.0 : 0.8,
            alternates: {
                languages: {
                    // 英文（默认）：https://site.com/pricing/
                    en: `${baseUrl}${cleanPath}`,
                    // 西班牙语：https://site.com/es/pricing/
                    es: `${baseUrl}/es${cleanPath}`,
                    // 德语：https://site.com/de/pricing/
                    de: `${baseUrl}/de${cleanPath}`,
                },
            },
        };
    });

    // 2. 动态生成的详情页
    const allPrintables = getAllPrintables();
    const dynamicUrls = allPrintables.map(item => {
        // 1. 清理数据中的 .html 后缀，并确保以 / 结尾
        // 假设 item.detailPage 是 "/printables/abc.html"
        // 结果: "/printables/abc/"
        const cleanPath = ensureTrailingSlash(item.detailPage.replace('.html', ''));

        return {
            url: `${baseUrl}${cleanPath}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
            alternates: {
                languages: {
                    en: `${baseUrl}${cleanPath}`,
                    es: `${baseUrl}/es${cleanPath}`,
                    de: `${baseUrl}/de${cleanPath}`,
                },
            },
        };
    });

    return [
        ...staticUrls,
        ...dynamicUrls,
    ];
}