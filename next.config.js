/** @type {import('next').NextConfig} */
const nextConfig = {
    // Static export → pure HTML/CSS/JS in out/ (no Node server needed).
    output: "export",
    // next/image can't optimize at runtime on a static host.
    images: { unoptimized: true },
    // Emit /path/index.html so any static host serves clean URLs.
    trailingSlash: true,
};

module.exports = nextConfig;
