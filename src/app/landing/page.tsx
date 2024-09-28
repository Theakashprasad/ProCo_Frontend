"use client";
import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/HeroSection";
import FeatureSection from "../../components/landing/FeatureSection";
import Workflow from "../../components/landing/Workflow";
import Pricing from "../../components/landing/Pricing";
import Testimonials from "../../components/landing/Testimonials";
import Footer from "../../components/landing/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Hero />
        <FeatureSection />
        <Workflow />
        <Pricing />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
}
