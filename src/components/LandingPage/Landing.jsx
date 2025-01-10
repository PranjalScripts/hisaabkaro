import React, { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Stats from "./stats";
import { Testimonials } from "./Testimonials";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import Signup from "../auth/login/signup";

function Landing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar setShowLoginModal={setShowLoginModal} />
      <HeroSection setShowLoginModal={setShowLoginModal} />
      <Stats />
      <FeaturesSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
      />
      {showSignupModal && (
        <Signup
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}

export default Landing;
