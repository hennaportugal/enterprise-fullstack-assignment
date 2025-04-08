/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // Allow importing ES Modules without extensions
      },
    });
    return config;
  },
};

module.exports = nextConfig;
