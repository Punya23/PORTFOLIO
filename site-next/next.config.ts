import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  // The repo root also has a lockfile (old Vite site); pin the root to this app.
  turbopack: { root: path.resolve(__dirname) },
};
export default config;
