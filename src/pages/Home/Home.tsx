import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import backgroundImage from "../../assets/Photo/Background/background-black.jpg";

import CircularText from "../../components/CircularText";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContactModal from "../../components/Lanyard/ContactModal";

import gravgunCursor from "../../assets/Photo/Half-life/gravgun_vm_close.png";

gsap.registerPlugin(TextPlugin);

const Home = () => {
  const titleRef = useRef(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const toggleContactModal = () => {
    setIsContactModalVisible(!isContactModalVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => {
        console.error('Copy failed:', err);
      });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background image and overlay - MIDDLE LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center">
          {/* Background image would go here */}
        </div>
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>

      {/* Content - TOP LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onContactClick={toggleContactModal} />

        {/* Contact Modal */}
        <ContactModal 
          isVisible={isContactModalVisible}
          onClose={toggleContactModal}
          onCopy={copyToClipboard}
          copiedText={copiedText}
        />

        {/* Main Content */}
        <div
          className={`flex flex-1 flex-col justify-center items-center px-4 text-center pt-20 transition-opacity duration-300 ${
            isContactModalVisible ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl font-[PowerGrotesk] text-white leading-tight"
          >
            Ahmet Alp Samur
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-white/70 text-base md:text-lg font-light tracking-wide">
            Full-Stack Developer • AI Enthusiast • Digital Craftsman
          </p>

          {/* Animated Line */}
          <div className="mt-6 w-24 h-[2px] bg-gradient-to-r from-white/20 via-white to-white/20" />

          {/* Description */}
          <p className="mt-6 max-w-xl text-white/60 text-sm md:text-base leading-relaxed">
            Welcome to my digital universe — where code meets creativity.<br />
            I design and develop web experiences powered by clean code,
            modern tools and bold ideas.
          </p>

          {/* Tech Stack Badges */}
          <div className="mt-10 flex flex-wrap gap-2 justify-center text-xs text-white/50">
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              React
            </span>
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Node.js
            </span>
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              TypeScript
            </span>
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Flutter
            </span>
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Python
            </span>
            <span className="border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              AI / ML
            </span>
          </div>
        </div>
      </div>

      {/* Circular Text at Bottom Right */}
      <div className="fixed right-6 bottom-6 z-20">
        <div className="w-40 h-40 md:w-48 md:h-48 relative">
          <CircularText
            text="SCROLL DOWN•SCROLL DOWN•SCROLL DOWN•"
            spinDuration={30}
            onHover="speedUp"
            radius={70}
            className="text-white"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;