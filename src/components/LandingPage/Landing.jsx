 import React, { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Stats from "./stats";
import { Testimonials } from "./Testimonials";
import CTASection from "./CTASection";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

function Landing() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar setShowLoginModal={setShowLoginModal} />
      <HeroSection setShowLoginModal={setShowLoginModal} />
      <Stats />
      <FeaturesSection />
      <Testimonials />
      <CTASection />
      <Footer />
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
}

export default Landing;