/** @type {import('next').NextConfig} */
// Optional base path for a GitHub Pages *project* site (e.g. "/haptica-landing").
// Leave PAGES_BASE_PATH unset for a root / custom-domain (famit.in) deploy.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
    // Static export → pure HTML/CSS/JS in out/ (no Node server needed).
    output: "export",
    // TypeScript still gates the build; skip the stylistic ESLint gate
    // (marketing copy carries lots of apostrophes/quotes).
    eslint: { ignoreDuringBuilds: true },
    // next/image can't optimize at runtime on a static host.
    images: { unoptimized: true },
    // Emit /path/index.html so any static host serves clean URLs.
    trailingSlash: true,
    // basePath only when building for a Pages project subpath.
    ...(basePath ? { basePath } : {}),
};

module.exports = nextConfig;
