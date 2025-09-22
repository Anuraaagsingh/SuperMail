/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add support for path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supermail': `${__dirname}/src`,
    };
    return config;
  },
  // Skip type checking during build for faster builds
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static optimization for pages that use dynamic routes
  images: {
    unoptimized: true,
  },
  // Disable static generation
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
