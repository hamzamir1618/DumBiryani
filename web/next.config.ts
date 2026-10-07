import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The photographs are large originals; these are the two sizes the
    // components actually ask for.
    qualities: [75, 86],
  },
};

export default nextConfig;
