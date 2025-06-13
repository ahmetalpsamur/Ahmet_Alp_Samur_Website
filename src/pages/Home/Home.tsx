import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import backgroundImage from "../../assets/Photo/Background/background-black.jpg";
// Social Icons
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";
import CircularText from "../../components/CircularText";
import Header from "../../components/Header/Header";
import Lanyard from "../../components/Lanyard/Lanyard";

gsap.registerPlugin(TextPlugin);

const Home = () => {
  const titleRef = useRef(null);
  const lanyardRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLanyardVisible, setIsLanyardVisible] = useState(false);
  const [lanyardKey, setLanyardKey] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const toggleLanyard = () => {
    if (!lanyardRef.current || !overlayRef.current) return;

    if (isLanyardVisible) {
      // Close animation
      gsap.to(lanyardRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          setIsLanyardVisible(false);
          gsap.set(lanyardRef.current, { y: 0 });
        }
      });
    } else {
      // Open animation
      setLanyardKey(prev => prev + 1);
      setIsLanyardVisible(true);
      
      // Show overlay first
      gsap.set(overlayRef.current, { display: "block", opacity: 0 });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });

      // Then animate Lanyard in
      gsap.fromTo(lanyardRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out"
        }
      );
    }
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
        <Header onContactClick={toggleLanyard} />
        
        {/* Fullscreen overlay for Lanyard */}
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black z-20 hidden"
          style={{ display: isLanyardVisible ? "block" : "none" }}
        ></div>

        {/* Lanyard */}
        <div
          ref={lanyardRef}
          className="fixed inset-0 z-30 flex items-center justify-center"
          style={{ 
            opacity: isLanyardVisible ? 1 : 0,
            pointerEvents: isLanyardVisible ? 'auto' : 'none' 
          }}
        >
          <Lanyard 
            key={lanyardKey}
            position={[0, 0, 20]} 
            gravity={[0, -40, 0]} 
          />
        </div>

        <div 
          className={`flex flex-1 flex-col justify-center items-center px-4 text-center pt-20 transition-opacity duration-300 ${
            isLanyardVisible ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p
            ref={titleRef}
            className="text-sm md:text-base tracking-[0.4em] uppercase text-white/60 font-light"
          >
            Full-Stack Developer
          </p>

          <div className="max-w-xl mt-10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              <span className="font-power text-white">HELLO</span>{" "}
              <span className="font-[PowerGrotesk] text-white">HELLO</span>
              <span className="text-white/50">—</span> <br className="md:hidden" />
              welcome to my digital universe.
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              I create elegant digital experiences with simplicity, aesthetics and technology.
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ahmet-alp-samur/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-white text-xl md:text-2xl" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs text-white/70 transition-opacity duration-300">
                LinkedIn
              </span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/ahmetalpsamur"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="GitHub"
            >
              <FaGithub className="text-white text-xl md:text-2xl" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs text-white/70 transition-opacity duration-300">
                GitHub
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/ahmetalpsamur/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-xl md:text-2xl" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs text-white/70 transition-opacity duration-300">
                Instagram
              </span>
            </a>

            {/* Email */}
            <button
              onClick={() => copyToClipboard('ahmetalpsamur@gmail.com')}
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="Email"
            >
              <SiGmail className="text-white text-xl md:text-2xl" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs text-white/70 transition-opacity duration-300">
                Email
              </span>
            </button>

            {/* LeetCode */}
            <a
              href="https://leetcode.com/ahmetalpsamur/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="LeetCode"
            >
              <SiLeetcode className="text-white text-xl md:text-2xl" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs text-white/70 transition-opacity duration-300">
                LeetCode
              </span>
            </a>
          </div>
        </div>
      </div>

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

      {/* Copy Notification */}
      {copiedText && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-out z-50">
          <SiGmail className="mr-2" />
          <span>Copied: <strong>{copiedText}</strong></span>
        </div>
      )}
    </div>
  );
};

export default Home;