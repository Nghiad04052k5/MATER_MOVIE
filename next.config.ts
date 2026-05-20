import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost:3000', '192.168.107.1:3000'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.107.1:3000'],
    },
  },
};

export default withNextIntl(nextConfig);
