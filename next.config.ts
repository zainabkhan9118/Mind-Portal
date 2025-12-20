import type { NextConfig } from "next";

/** 
 * Next.js configuration for Vercel deployment
 */
const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // turbopack: {} is required when using custom webpack config in Next.js 16+
  // to acknowledge that you are using a custom webpack configuration.
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  typedRoutes: false,

  experimental: {
    optimizeCss: false // Disable lightningcss optimizer
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
