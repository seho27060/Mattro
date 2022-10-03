/** @type {import('next').NextConfig} */
const { redirect } = require("next/dist/server/api-utils");
const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `
            @import "_variables.scss";
            @import "_utils.scss";
          `
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // async redirect() {
  //   return [
  //     {
  //       source: `/theme/:choices/:path/(\\)`,
  //       destination: "/404",
  //       permanent: false
  //     }
  //   ];
  // }
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            name: "[name]-[hash].[ext]"
          }
        }
      ]
    });
    return config;
  }
};

module.exports = nextConfig;
