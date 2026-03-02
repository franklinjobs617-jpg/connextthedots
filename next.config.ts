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
        return [
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

        ];
    },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);