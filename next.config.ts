import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false
      }
    ]
  }
};

export default nextConfig;
