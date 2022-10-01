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
  }

  // async redirect() {
  //   return [
  //     {
  //       source: `/theme/:choices/:path/(\\)`,
  //       destination: "/404",
  //       permanent: false
  //     }
  //   ];
  // }
};

module.exports = nextConfig;
