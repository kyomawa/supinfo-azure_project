/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "random.imagecdn.app",
      },
      {
        protocol: "https",
        hostname: "supinfoprojectstorage.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
