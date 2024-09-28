import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "static.vecteezy.com",
      "images.unsplash.com",
      "procowebsite.s3.eu-north-1.amazonaws.com",
      "i.pinimg.com",
      "avatar.iran.liara.run", // Added domain for avatars
    ],
  },
};

export default withNextVideo(nextConfig);
