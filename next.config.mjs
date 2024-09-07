/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.wikia.nocookie.net',
            },
            {
                protocol: 'https',
                hostname: 'media.valorant-api.com',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
