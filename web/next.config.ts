import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['@zh-keyboard/recognizer', '@zh-keyboard/core'],
  eslint: { ignoreDuringBuilds: true },
};

if (!isDev) {
  nextConfig.output = 'export';
} else {
  nextConfig.rewrites = async () => [
    { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
  ];
}

export default nextConfig;
