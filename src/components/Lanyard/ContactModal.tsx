import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";
import Lanyard from "./Lanyard";
import ScrollVelocity from "../ScrollVelocity";

interface ContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
  copiedText: string | null;
}

const ContactModal = ({ isVisible, onClose, onCopy, copiedText }: ContactModalProps) => {
  const lanyardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const socialButtonsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lanyardRef.current || !overlayRef.current || !socialButtonsRef.current) return;

    if (isVisible) {
      // Open animation
      gsap.set(overlayRef.current, { display: "block", opacity: 0 });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });

      // Animate Lanyard in
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

      // Show social buttons
      gsap.fromTo(socialButtonsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.5,
          ease: "back.out"
        }
      );
    } else {
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
      });
      gsap.to(socialButtonsRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(lanyardRef.current, { y: 0 });
        }
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black z-20 hidden"
        onClick={onClose}
      />

      {/* Contact title */}
      <div className="fixed top-24 left-0 w-full z-30 flex justify-center">
        <div
          className="bg-white px-6 py-2 rounded-md shadow-md"
          style={{ transform: "rotate(-2deg)" }}
        >
          <ScrollVelocity
            texts={["CONTACT ME *"]}
            velocity={25}
            className="font-[PowerGrotesk] text-black tracking-wide"
          />
        </div>
      </div>

      {/* Lanyard */}
      <div
        ref={lanyardRef}
        className="fixed inset-0 z-30 flex items-center justify-center"
      >
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
        />
      </div>

      {/* Social Media Buttons */}
      <div
        ref={socialButtonsRef}
        className="fixed bottom-6 inset-x-0 z-40"
      >
        <div className="w-full py-5 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4">
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
              onClick={() => onCopy('ahmetalpsamur@gmail.com')}
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

      {/* Copy Notification */}
      {copiedText && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-out z-50">
          <SiGmail className="mr-2" />
          <span>Copied: <strong>{copiedText}</strong></span>
        </div>
      )}
    </>
  );
};

export default ContactModal;