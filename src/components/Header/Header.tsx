import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiPhone } from "react-icons/fi";

import logo from "../../assets/Logo/ahmetalpsamur_logo.png";
import Threads from "./Thread";

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
  isContactActive?: boolean;
  onContactClick?: () => void;
}

const Header = ({
  isContactActive = false,
  onContactClick,
}: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!headerRef.current || !logoRef.current) return;

    const headerTween = gsap.to(headerRef.current, {
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=200",
        scrub: true,
      },
    });

    const logoTween = gsap.to(logoRef.current, {
      scale: 0.9,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=300",
        scrub: true,
      },
    });

    return () => {
      headerTween.scrollTrigger?.kill();
      logoTween.scrollTrigger?.kill();
      headerTween.kill();
      logoTween.kill();
    };
  }, []);

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/projects", name: "Projects" },
    { path: "/contact", name: "Contact" },
    { path: "/blog", name: "Blog" },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full flex-none px-2 transition-all duration-500 sm:px-5"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center">
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={onContactClick}
          aria-pressed={isContactActive}
          className="flex items-center justify-self-start gap-2"
        >
          <motion.span
            animate={{ rotate: isContactActive ? 0 : 135 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="rounded-full p-1"
          >
            <FiPhone className="text-xl text-white transition-all duration-300 sm:text-3xl" />
          </motion.span>
          <span className="font-[PowerGrotesk] text-xl uppercase tracking-wider sm:text-3xl">
            Contact
          </span>
        </motion.button>

        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex items-center justify-center"
        >
          <Link
            ref={logoRef}
            to="/"
            className="group relative flex items-center"
            aria-label="Go to home page"
          >
            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 blur-md transition-all duration-500 group-hover:bg-white/20 group-hover:opacity-100 group-hover:blur-lg" />
            <span className="relative z-10 rounded-full border border-white/10 p-1 transition-all duration-500 group-hover:border-white/20">
              <img
                src={logo}
                alt="Ahmet Alp Samur"
                className="h-15 w-auto transition-transform duration-300 group-hover:scale-105 md:h-20"
              />
            </span>
          </Link>
        </motion.div>

        <button
          type="button"
          className="relative z-50 flex items-center justify-self-end gap-2 text-white focus:outline-none"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-menu"
        >
          <span className="font-[PowerGrotesk] text-xl uppercase tracking-wider sm:text-3xl">
            Menu
          </span>
          <span className="flex w-6 flex-col items-end space-y-1.5" aria-hidden="true">
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-4"}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="primary-menu"
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 pt-20 backdrop-blur-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="w-full max-w-2xl">
              <nav aria-label="Primary navigation">
                <motion.ul className="flex flex-col items-center space-y-6 px-5">
                  {navItems.map(({ path, name }, index) => (
                    <motion.li
                      key={path}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full text-center"
                    >
                      <Link
                        to={path}
                        className={`block rounded-full px-5 py-3 font-[PowerGrotesk] text-4xl font-medium uppercase transition-all duration-300 md:text-5xl ${
                          location.pathname === path
                            ? "bg-white text-black"
                            : "text-white/70 hover:text-white"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {name}
                        <span className="ml-2 font-mono text-sm md:text-base">
                          ({String(index).padStart(2, "0")})
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              <motion.div className="w-full" variants={itemVariants}>
                <Threads
                  amplitude={1.2}
                  distance={0.4}
                  enableMouseInteraction
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
