import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async headers() {
    return [
      {
  
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
     
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
  
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },


  reactStrictMode: true,

  productionBrowserSourceMaps: false,


  compress: true,

  
  poweredByHeader: false,

};

export default nextConfig;
