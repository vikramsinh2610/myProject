/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // i18n: {
  //   locales: ["en", "de"],
  //   defaultLocale: "en",
  // },
  images: {
    domains: [
      "giftlips.s3-accelerate.amazonaws.com",
      "d3pnv6nbr6dvzn.cloudfront.net",
      "giftlips-staging.s3-accelerate.amazonaws.com",
      "d2cpdbqqenx5zx.cloudfront.net",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.giftlips.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
};

module.exports = nextConfig;
