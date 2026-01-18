import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Standalone output for optimized Vercel deployment (smaller Docker containers)
    output: 'standalone',

    // Ignore build errors for faster deployment
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Remote image patterns
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            // Facebook
            {
                protocol: 'https',
                hostname: 'scontent.xx.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'scontent-*.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: '**.facebook.com',
            },
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
            },
            // Instagram
            {
                protocol: 'https',
                hostname: '**.cdninstagram.com',
            },
            {
                protocol: 'https',
                hostname: '**.instagram.com',
            },
            // Telegram
            {
                protocol: 'https',
                hostname: 'api.telegram.org',
            },
        ],
    },
};

export default withSerwist(nextConfig);
