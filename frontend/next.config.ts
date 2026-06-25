import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /provinces/:id was an alternate lesson view; the canonical lesson
      // experience now lives under /lessons/:id.
      {
        source: "/provinces/:id",
        destination: "/lessons/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;