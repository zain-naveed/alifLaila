/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      loader: "@svgr/webpack",
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
        titleProp: true,
      },

      test: /\.svg$/,
      // use:"@svgr/webpack"
    });
    return config;
  },
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.aliflaila.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev.upworkdeveloper.com",
        port: "",
        pathname: "/new/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
    // formats: ["image/webp"]
  },
};

module.exports = nextConfig;
