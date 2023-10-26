/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "d3pnv6nbr6dvzn.cloudfront.net",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daisyui.com",
      },
      {
        protocol: "https",
        hostname: "d3pnv6nbr6dvzn.cloudfront.net",
      },
    ],
  },
};

module.exports = nextConfig;