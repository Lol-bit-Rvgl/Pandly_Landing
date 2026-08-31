/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ---- Static asset handling ---- */
  webpack(config) {
    /* WebAssembly — async streaming compilation */
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },

  /* ---- Security & performance headers for SharedArrayBuffer / SIMD ---- */
  async headers() {
    return [
      {
        /* COOP/COEP for all routes — enables crossOriginIsolated (SharedArrayBuffer, SIMD) */
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
      {
        /* WASM binaries: correct MIME + aggressive cache (content-hashed by Next.js) */
        source: "/(.*)\\.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },

  /* ---- Output configuration ---- */
  output: "standalone",

  /* ---- Image optimization (for logo, assets) ---- */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default nextConfig;
