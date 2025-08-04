import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  
  // Optimize images automatically
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      '@mynaui/icons-react',
      'lucide-react',
      'react-markdown',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot'
    ],
  },
  
  // Configure webpack for bundle analysis
  webpack: (config, { isServer }) => {
    // Enable bundle analyzer in production builds with ANALYZE env var
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;
