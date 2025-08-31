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
  experimental: {
    typedRoutes: false,
    optimizeCss: false // Disable lightningcss optimizer
  },
  // Remove custom distDir to prevent routes-manifest.json error
  // distDir: '.vercel_build_output',
  
  // Additional configuration specific to Vercel deployment

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
