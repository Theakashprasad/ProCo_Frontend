import { BotMessageSquare } from "lucide-react";
import { Youtube } from "lucide-react";
import { CircleUser } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { NotebookTabs } from "lucide-react";

import user1 from "../assets/landing/profile-pictures/user1.jpg";
import user2 from "../assets/landing/profile-pictures/user2.jpg";
import user4 from "../assets/landing/profile-pictures/user4.jpg";
import user5 from "../assets/landing/profile-pictures/user5.jpg";
import user3 from "../assets/landing/profile-pictures/user3.jpg";
import user6 from "../assets/landing/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "Working with the team at XYZ Company was a game-changer for our project. Their attention to detail and innovative solutions helped us achieve our goals faster than we thought possible",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "I am amazed by the level of professionalism and dedication shown by the team. They were able to exceed our expectations and deliver outstanding results.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "The team went above and beyond to ensure our project was a success. Their expertise and dedication are unmatched. I look forward to working with them again in the future.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Post",
    description:
      " Efficiently managing communication and connectivity needs for professionals, enhancing productivity and success in modern workplaces.",
  },
  {
    icon: <CircleUser />,
    text: "Profile",
    description:
    "Dedicated expertise, experience, and achievements defining a career committed to excellence and innovation in [industry/field].",
  },
  {
    icon: <MessageCircle />,
    text: "Message",
    description:
      " Connecting instantly, bridging distances, and sharing moments effortlessly with seamless communication solutions.",
  },
  {
    icon: <Youtube />,
    text: "Video vall",
    description:
      "Face-to-face conversations across distances, enhancing communication with real-time interactions and personal connections.",
  },
  {
    icon: <BookmarkCheck />,
    text: "Todo",
    description:
      " Organize tasks efficiently, prioritize goals, and achieve milestones with structured planning and productivity tools.",
  },
  {
    icon: <NotebookTabs />,
    text: "Note pad",
    description:
      " Capture thoughts, ideas, and reminders, keeping notes organized for easy reference and productivity.",
  },
];

export const checklistItems = [
  {
    title: "Instant message",
    description:
      "Swiftly exchange messages, fostering quick communication and collaboration across digital platforms for efficient interactions.",
  },
  {
    title: "Instant Payment",
    description:
      " Rapid and secure transactions, ensuring immediate financial transfers for convenient and efficient digital commerce.",
  },
  {
    title: "Instant Video Call",
    description:
      "Real-time face-to-face communication, enabling immediate, visual interactions for seamless collaboration and connection.",
  },
  {
    title: "Instant Response:",
    description:
      "Prompt and efficient replies, ensuring timely communication and swift resolution of inquiries or issues.",
  },
];

export const pricingOptions = 
  {
    title: "Pro",
    price: "500 ₹",
    features: [
      "Unlimited chat",
      "Video call",
      "Todo",
      "Note Pad",
    ],
  };


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
