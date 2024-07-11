import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.vecteezy.com", "images.unsplash.com"],
  },
};

export default withNextVideo(nextConfig);
