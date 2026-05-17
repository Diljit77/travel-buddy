import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async headers() {
    return [
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
  typescript: {
    ignoreBuildErrors: true,
  },

  productionBrowserSourceMaps: false,


  compress: true,

  
  poweredByHeader: false,

};

export default nextConfig;
