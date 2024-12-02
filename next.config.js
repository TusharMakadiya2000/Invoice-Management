/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            "s3.tebi.io",
        ],
    },
}

module.exports = nextConfig
