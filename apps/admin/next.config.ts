import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  reactStrictMode: true,
  compress: true,

  transpilePackages: [
    "@persontoolbox/db",
    "@persontoolbox/shared",
    "@persontoolbox/ui",
    "@persontoolbox/rules-engine",
  ],

  turbopack: {
    resolveAlias: {
      "@packages/*": ["../../packages/*"],
      "@/lib/generated/*": ["../../lib/generated/*"],
    },
  },
};

export default nextConfig;
