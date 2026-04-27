import React from "react";
import "./landing.css";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { StatsBar } from "../components/landing/StatsBar";
import { AboutSection } from "../components/landing/AboutSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { OHSUSection } from "../components/landing/OHSUSection";
import { TeamSection } from "../components/landing/TeamSection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { ScreenshotsSection } from "../components/landing/ScreenshotSection";

const Landing: React.FC = () => (
  <div className="landing-root">
    <Navbar />
    <main className="landing-main">
      <Hero />
      <StatsBar />
      <AboutSection />
      <HowItWorks />
      <ScreenshotsSection />
      <OHSUSection />
      <TeamSection />
    </main>
    <LandingFooter />
  </div>
);

export default Landing;
export { Landing };
