import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.r2.dev',
            },
            {
                protocol: 'https',
                hostname: 'cdn.prod.website-files.com',
            },
            {
                protocol: 'https',
                hostname: 'media.theresanaiforthat.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }, {
                protocol: 'https',
                hostname: 'cdn.startupslab.site',
            }, {
                protocol: 'https',
                hostname: 'launchigniter.com',
            }

        ],
        // domains: ['pub-476193f3c5084ebaabd517e2c8788715.r2.dev', "cdn.prod.website-files.com"],
    },
    trailingSlash: true,
    async redirects() {
        // 已下线的版权风险 printable 详情页（Bluey / SpongeBob）
        // 统一 301 跳转到对应语言的免费图库 Hub 页，覆盖全部 7 个语言前缀
        const localePrefixes = ['', '/de', '/es', '/pt', '/fr', '/it', '/nl'];
        const removedPrintableSlugs = [
            'easy-bluey-01-connect-the-dots-puzzle-1-25-numbers',
            'medium-spongebob-01-connect-the-dots-puzzle-1-50-numbers',
        ];

        const removedPrintableRedirects = localePrefixes.flatMap((prefix) =>
            removedPrintableSlugs.flatMap((slug) => ([
                {
                    source: `${prefix}/printables/${slug}`,
                    destination: `${prefix}/printable-connect-the-dots/`,
                    permanent: true,
                },
                {
                    source: `${prefix}/printables/${slug}/`,
                    destination: `${prefix}/printable-connect-the-dots/`,
                    permanent: true,
                },
            ]))
        );

        // 合并重复的圣诞节页面：/printables/christmas/ 与 /christmas-printables/ 曾同时存在
        // 内部竞争同一意图，统一保留 /christmas-printables/，旧 URL 301 跳转过去
        const christmasMergeRedirects = localePrefixes.flatMap((prefix) => ([
            {
                source: `${prefix}/printables/christmas`,
                destination: `${prefix}/christmas-printables/`,
                permanent: true,
            },
            {
                source: `${prefix}/printables/christmas/`,
                destination: `${prefix}/christmas-printables/`,
                permanent: true,
            },
        ]));

        // 早期低质量的重复图库/详情页，统一 301 到对应的正式页面
        // core / general 都是"终极图库合集"页，与 /printable-connect-the-dots/ 重复
        // adults / hard 是单图详情页，图片已由标准 [slug] 系统覆盖，且与 /connect-the-dots-for-adults/ 重复
        const legacyDuplicateRedirects = localePrefixes.flatMap((prefix) => {
            const pairs: [string, string][] = [
                ['/printables/core', `${prefix}/printable-connect-the-dots/`],
                ['/printables/general', `${prefix}/printable-connect-the-dots/`],
                ['/printables/adults', `${prefix}/connect-the-dots-for-adults/`],
                ['/printables/hard', `${prefix}/connect-the-dots-for-adults/`],
            ];
            return pairs.flatMap(([source, destination]) => ([
                { source: `${prefix}${source}`, destination, permanent: true },
                { source: `${prefix}${source}/`, destination, permanent: true },
            ]));
        });

        // /printables/animals/ 单独处理：GSC年度数据证实 es 版本已有真实排名信号
        // （年曝光1661次，均位7.58），保留并重建；其余语言版本仍跳转到官方动物图库页
        const animalsPrefixes = localePrefixes.filter((p) => p !== '/es');
        const animalsRedirects = animalsPrefixes.flatMap((prefix) => ([
            {
                source: `${prefix}/printables/animals`,
                destination: `${prefix}/free-animal-dot-to-dot-printables-pdf/`,
                permanent: true,
            },
            {
                source: `${prefix}/printables/animals/`,
                destination: `${prefix}/free-animal-dot-to-dot-printables-pdf/`,
                permanent: true,
            },
        ]));

        return [
            {
                source: '/testpricing',
                destination: '/pricing',
                permanent: true,
            },
            {
                source: '/testpricing/',
                destination: '/pricing/',
                permanent: true,
            },
            {
                source: '/index.html',
                destination: '/',
                permanent: true,
            },
            {
                source: '/:path*/index.html',
                destination: '/:path*/',
                permanent: true,
            },
            {
                // 匹配多层目录下的 html 文件，例如 /guide/tools/test.html
                // :path+ 匹配一层或多层目录
                // :slug 匹配最后的文件名
                source: '/:path+/:slug.html',
                destination: '/:path+/:slug/',
                permanent: true,
            },
            {
                // 匹配根目录下的 html 文件，例如 /about.html
                source: '/:slug.html',
                destination: '/:slug/',
                permanent: true,
            },
            ...removedPrintableRedirects,
            ...christmasMergeRedirects,
            ...legacyDuplicateRedirects,
            ...animalsRedirects,
        ];
    },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
