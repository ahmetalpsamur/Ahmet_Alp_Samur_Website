import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";
import Dither from "../Background/Dither";
import FallingText from "../FallingText";

import gravgunInset from "../../assets/Photo/Half-life/gravgun-inset.png";
import gravgunCursor from "../../assets/Photo/Half-life/gravgun_vm_close.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [fallingStarted, setFallingStarted] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");

  const handleGravgunClick = () => {
    setFallingStarted(true);
    setCursorStyle(`url(${gravgunCursor}), auto`);
  };

  // Apply cursor style to the document body when it changes
  useEffect(() => {
    document.body.style.cursor = cursorStyle;
    return () => {
      document.body.style.cursor = "default";
    };
  }, [cursorStyle]);

  // Reset cursor when mouse leaves the gravgun area
  const handleMouseLeave = () => {
    if (!fallingStarted) {
      setCursorStyle("default");
    }
  };

  const socialLinks = [
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://www.linkedin.com/in/ahmet-alp-samur/",
      label: "LinkedIn",
    },
    {
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/ahmetalpsamur",
      label: "GitHub",
    },
    {
      icon: <FaInstagram className="text-xl" />,
      url: "https://www.instagram.com/ahmetalpsamur/",
      label: "Instagram",
    },
    {
      icon: <SiGmail className="text-xl" />,
      url: "mailto:ahmetalpsamur@gmail.com",
      label: "Email",
    },
    {
      icon: <SiLeetcode className="text-xl" />,
      url: "https://leetcode.com/ahmetalpsamur/",
      label: "LeetCode",
    },
  ];

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <footer className="relative bg-black text-white border-t border-white/10 overflow-hidden">
      {/* Dither Background */}
      <Dither />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8">
          {/* Açıklama */}
          <div className="mb-4 md:mb-6 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white/60 text-center max-w-lg mx-auto text-sm md:text-base"
            >
              Creating elegant digital experiences with simplicity, aesthetics and technology.
            </motion.p>
          </div>

          {/* Sosyal Medya Linkleri */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center space-x-6 mb-4 md:mb-6"
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors duration-300"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </motion.div>

          {/* Navigasyon Linkleri */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-4 md:mb-6"
          >
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="text-sm uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-300 font-[PowerGrotesk]"
              >
                {link.name}
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center text-xs text-white/40"
          >
            © {currentYear} Ahmet Alp Samur. All rights reserved.
          </motion.div>

          {/* Falling Text + Gravgun */}
          <div className="relative w-full h-[400px] md:h-[600px] bg-black/20 border-t border-b border-white/10 my-12 overflow-hidden">
            {/* FallingText */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <FallingText
                text="HOME ABOUT PROJECTS CONTACT BLOG 😆"
                trigger={fallingStarted ? "auto" : "click"}
                gravity={0.3}
                fontSize="1.5rem"
              />
            </div>

            {/* Gravgun Image (Trigger) */}
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-50 cursor-[url(${gravgunCursor}),_pointer]`}
              onMouseLeave={handleMouseLeave}
              onClick={handleGravgunClick}
            >
              <img
                src={gravgunInset}
                alt="Gravgun"
                className="w-32 hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;