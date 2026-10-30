import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "mindstory.in", pathname: "/wp-content/**" }],
  },
};

export default nextConfig;
