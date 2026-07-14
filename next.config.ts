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
        ];
    },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
