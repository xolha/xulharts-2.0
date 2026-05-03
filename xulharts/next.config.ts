import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  
  async redirects() {
    return [
      {
        source: '/xulha',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
