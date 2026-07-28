import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Cursor workspace is often the parent `Full_Clone_Jira` folder (sibling `api-jira`).
// Turbopack can pick the wrong root and panic with "Next.js package not found".
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
