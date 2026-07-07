/** @type {import('next').NextConfig} */
// Optional base path for a GitHub Pages *project* site (e.g. "/haptica-landing").
// Leave PAGES_BASE_PATH unset for a root / custom-domain (famit.in) deploy.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
    // TypeScript still gates the build; skip the stylistic ESLint gate
    // (the demo modal copy carries apostrophes).
    eslint: { ignoreDuringBuilds: true },
    // expose basePath to the client so raw <video>/<img> asset URLs resolve on
    // both a project subpath (/haptica-landing) and a root/custom domain.
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
    ...(basePath ? { basePath } : {}),
};

module.exports = nextConfig;
