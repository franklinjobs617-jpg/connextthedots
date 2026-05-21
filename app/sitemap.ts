import { MetadataRoute } from 'next';
import { getAllPrintables } from '@/lib/printables-data';

const baseUrl = 'https://connectthedotsprintable.online';
const siteLocales = ['en', 'de', 'es', 'pt', 'fr', 'it', 'nl'];

const ensureTrailingSlash = (path: string) => {
    if (path === '/') return '/';
    return path.endsWith('/') ? path : `${path}/`;
};

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: Array<{ path: string; locales?: string[]; priority?: number }> = [
        { path: '/', locales: siteLocales, priority: 1.0 },
        { path: '/pricing', locales: siteLocales },
        { path: '/printable-connect-the-dots', locales: siteLocales },
        { path: '/how-to-make', locales: siteLocales },
        { path: '/christmas-printables', locales: siteLocales },
        { path: '/free-animal-dot-to-dot-printables-pdf', locales: siteLocales },
        { path: '/popular-character-dot-to-dot-printable-worksheets', locales: siteLocales },
        { path: '/printables/adults', locales: siteLocales },
        { path: '/printables/animals', locales: siteLocales },
        { path: '/printables/christmas', locales: siteLocales },
        { path: '/printables/core', locales: siteLocales },
        { path: '/printables/general', locales: siteLocales },
        { path: '/printables/hard', locales: siteLocales },
        { path: '/printables/connectTheDotsGenerator', locales: siteLocales },
        { path: '/connect-the-dots-1-to-10', locales: siteLocales },
        { path: '/connect-the-dots-coloring-pages', locales: siteLocales },
        { path: '/blog/are-dot-to-dot-puzzles-good-for-kids', locales: siteLocales },
        { path: '/convert-photo-to-beads', locales: siteLocales },
        { path: '/gallery', locales: siteLocales },
        { path: '/editor', locales: siteLocales },
        { path: '/privacy', locales: siteLocales },
        { path: '/terms', locales: siteLocales },
        { path: '/dmca', locales: siteLocales },
        { path: '/dot-to-dot-generator-from-photo', locales: ['en'] },
        { path: '/make-your-own-dot-to-dot', locales: ['en'] },
    ];

    const staticUrls = staticPages.map(({ path, locales = siteLocales, priority = 0.8 }) => {
        const cleanPath = ensureTrailingSlash(path);
        const languages = Object.fromEntries(
            locales.map((locale) => [
                locale,
                `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${cleanPath}`,
            ])
        );

        return {
            url: `${baseUrl}${cleanPath}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority,
            alternates: { languages },
        };
    });

    const allPrintables = getAllPrintables();
    const dynamicUrls = allPrintables.map((item) => {
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

    return [...staticUrls, ...dynamicUrls];
}
