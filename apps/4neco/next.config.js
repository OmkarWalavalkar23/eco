// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trust.profiles.eco',
      },
    ],
    dangerouslyAllowSVG: true, // If SVG support is needed
  },
  output: 'standalone',
};
