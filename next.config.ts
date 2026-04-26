import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow image optimization from Supabase
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Proxy Supabase requests through Vercel to bypass ISP blocks (like Jio in India)
  async rewrites() {
    return [
      {
        source: "/api/supabase/:path*",
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
