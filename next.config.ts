import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
