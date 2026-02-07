import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Suprime avisos de hidratação causados por IDs dinâmicos do Radix UI
  // Isso é seguro porque os componentes funcionam corretamente após a hidratação
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
