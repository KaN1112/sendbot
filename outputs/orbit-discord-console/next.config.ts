import type { NextConfig } from "next";
const nextConfig: NextConfig = { outputFileTracingRoot: process.cwd(), serverExternalPackages: ["discord.js"], images: { remotePatterns: [{ protocol: "https", hostname: "cdn.discordapp.com" }] } };
export default nextConfig;
