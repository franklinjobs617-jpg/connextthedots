import { MetadataRoute } from 'next';
import { getAllPrintables } from '@/lib/printables-data';

const baseUrl = 'https://connectthedotsprintable.online';

/**
 * 辅助函数，确保路径有尾部斜杠
 * @param path 路径
 * @returns 带斜杠的路径
 */
const ensureTrailingSlash = (path: string) => {
    if (path === '/') return '/'; 
    return path.endsWith('/') ? path : `${path}/`;
};

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. 静态页面
    const staticPages = [
        '/',      
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
        '/connect-the-dots-1-to-10',
        '/blog/are-dot-to-dot-puzzles-good-for-kids',
        '/convert-photo-to-beads',
        '/gallery',
        '/editor',
        '/privacy',
        '/terms',
        '/dmca',
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
                    en: `${baseUrl}${cleanPath}`,
                    es: `${baseUrl}/es${cleanPath}`,
                    de: `${baseUrl}/de${cleanPath}`,
                    pt: `${baseUrl}/pt${cleanPath}`,
                    fr: `${baseUrl}/fr${cleanPath}`,
                    it: `${baseUrl}/it${cleanPath}`,
                    nl: `${baseUrl}/nl${cleanPath}`,
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
                    pt: `${baseUrl}/pt${cleanPath}`,
                    fr: `${baseUrl}/fr${cleanPath}`,
                    it: `${baseUrl}/it${cleanPath}`,
                    nl: `${baseUrl}/nl${cleanPath}`,
                },
            },
        };
    });

    return [
        ...staticUrls,
        ...dynamicUrls,
    ];
}
