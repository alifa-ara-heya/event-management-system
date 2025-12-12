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
    qualities: [75, 90],
  },
  // @ts-expect-error - serverActions is supported in Next.js 16 but not in type definitions
  serverActions: {
    bodySizeLimit: '10mb', // Increase limit for file uploads (default is 1mb)
  },
} satisfies NextConfig;

export default nextConfig;
