/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.wikia.nocookie.net',
            },
        ],
    },
};

export default nextConfig;
