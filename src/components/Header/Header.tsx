import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from "../../assets/Logo/ahmetalpsamur_logo.png";

import Threads from '../../components/Header/Thread';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!headerRef.current || !logoRef.current) return;

    // Scroll effect
    gsap.to(headerRef.current, {
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=200',
        scrub: true
      }
    });

    // Logo animation on scroll
    gsap.to(logoRef.current, {
      scale: 0.9,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=300',
        scrub: true
      }
    });

    // Close mobile menu when route changes
    const unlisten = () => setIsMenuOpen(false);
    return unlisten;
  }, []);

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/projects", name: "Projects" },
    { path: "/contact", name: "Contact" },
    { path: "/blog", name: "Blog" }
  ];

  const leftNavItems = navItems.slice(0, 2);
  const rightNavItems = navItems.slice(2);

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-50 py-4 px-4 sm:px-6 transition-all duration-500 "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left Navigation - Desktop */}
        <nav className="hidden md:flex flex-1 justify-end">
          <div className="flex space-x-6 lg:space-x-8 mr-4 lg:mr-8">
            {leftNavItems.map(({ path, name }, index) => (
              <motion.div
                key={path}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link
                  to={path}
                  className={`relative group text-sm uppercase tracking-wider font-medium transition duration-300 
                    ${location.pathname === path ? 'text-white' : 'text-white/70'} 
                    hover:text-white`}
                >
                  <span className="relative z-10">{name}</span>
                  <span
                    className={`absolute left-0 -bottom-1 w-full h-[1px] bg-white transition-all duration-300 
                      ${location.pathname === path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} 
                      origin-left`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Logo - Centered */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="mx-auto md:mx-4"
        >
          <Link
            ref={logoRef}
            to="/"
            className="flex items-center group"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 blur-md group-hover:blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative z-10 p-1 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-500">
                <img
                  src={logo}
                  alt="Ahmet Alp Samur Logo"
                  className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Right Navigation - Desktop */}
        <nav className="hidden md:flex flex-1 justify-start">
          <div className="flex space-x-6 lg:space-x-8 ml-4 lg:ml-8">
            {rightNavItems.map(({ path, name }, index) => (
              <motion.div
                key={path}
                custom={index + leftNavItems.length}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link
                  to={path}
                  className={`relative group text-sm uppercase tracking-wider font-medium transition duration-300 
                    ${location.pathname === path ? 'text-white' : 'text-white/70'} 
                    hover:text-white`}
                >
                  <span className="relative z-10">{name}</span>
                  <span
                    className={`absolute left-0 -bottom-1 w-full h-[1px] bg-white transition-all duration-300 
                      ${location.pathname === path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} 
                      origin-left`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col items-end space-y-1.5">
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
          </div>
        </button>



        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-lg pt-20 px-6 z-40"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <motion.ul className="flex flex-col space-y-8">
                {navItems.map(({ path, name }, index) => (
                  <motion.li
                    key={path}
                    variants={mobileItemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative" // Ekledim
                  >
                    <Link
                      to={path}
                      className={`text-5xl font-[PowerGrotesk] font-medium uppercase px-4 py-2 rounded transition-all duration-300
                    ${location.pathname === path ? 'bg-white text-black' : 'text-white/70'}
                  `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {name}
                      {/* Metnin hemen yanında indeks */}
                      <span className="text-xs font-mono ml-1 inline-block align-top -translate-y-0.25">
                        ({String(index).padStart(2, '0')})
                      </span>
                    </Link>
                  </motion.li>
                ))}
                    <Threads
    amplitude={2}
    distance={0}
    enableMouseInteraction={true}
  />
              </motion.ul>
              
              <motion.div
                className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                
              >

                © {new Date().getFullYear()} Ahmet Alp Samur
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </header>
  );
};

export default Header;