/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '*.googleusercontent.com'
            }
        ]
    },
    output: 'standalone'
};

export default nextConfig;