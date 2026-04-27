/** @type {import('next').NextConfig} */
const nextConfig = {
  // On low-RAM hosts, set NEXT_BUILD_CPUS=1 before `next build` to avoid OOM/SIGBUS on workers.
  experimental: {
    ...(process.env.NEXT_BUILD_CPUS
      ? { cpus: parseInt(process.env.NEXT_BUILD_CPUS, 10) || 1 }
      : {}),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  generateEtags: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/login",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ]
  },
}

export default nextConfig
