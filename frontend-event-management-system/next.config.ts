import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '10mb', // Increase limit for file uploads (default is 1mb)
  },
} satisfies NextConfig;

export default nextConfig;
