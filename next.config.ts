import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    '@heroui/react',
    '@heroui/theme',
    '@react-aria/ssr',
    '@react-stately/utils',
    '@nextui-org/react',
  ],
};

export default nextConfig;
