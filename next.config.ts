import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Next's default deviceSizes jump from 2048 straight to 3840 — any
    // container needing 2049-3839 physical pixels (e.g. the ~900px-wide
    // lightbox on a 2.5x-DPR screen, which needs ~2240px) rounds all the way
    // up to 3840, requesting far more pixels than needed and slowing the
    // load. Filling the gap keeps the same max quality for genuinely huge
    // displays while avoiding that overshoot for the common case.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3200, 3840],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
