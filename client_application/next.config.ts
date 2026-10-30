import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The worked example used to live here; old links keep working.
  async redirects() {
    return [{ source: "/sandbox/enrollment", destination: "/sandbox/add-a-sandbox-page", permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
