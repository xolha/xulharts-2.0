import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/xulha',
        destination: '/src/admin/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
