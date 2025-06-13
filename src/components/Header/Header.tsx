import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from "../../assets/Logo/ahmetalpsamur_logo.png";
import { FiPhone } from 'react-icons/fi';
import Threads from './Thread';

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
  onContactClick?: () => void;
}

const Header = ({ onContactClick }: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!headerRef.current || !logoRef.current) return;

    gsap.to(headerRef.current, {
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=200',
        scrub: true,
      },
    });

    gsap.to(logoRef.current, {
      scale: 0.9,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '+=300',
        scrub: true,
      },
    });
  }, []);

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/projects", name: "Projects" },
    { path: "/contact", name: "Contact" },
    { path: "/blog", name: "Blog" }
  ];

  const menuVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleContactClick = () => {
    setIsContactActive(prev => !prev);
    if (onContactClick) onContactClick();
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-50 py-1 px-4 sm:px-5 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">

        {/* Left CONTACT button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap cursor-pointer h-full flex-1 justify-start"
          onClick={handleContactClick}
        >
<motion.div
  animate={{
    rotate: isContactActive ? 135 : 0
  }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
  className="p-1 rounded-full"
>
  <FiPhone
    className="text-white text-xl sm:text-3xl transition-all duration-300"
  />
</motion.div>
          <span className='font-[PowerGrotesk] text-1xl sm:text-3xl uppercase tracking-wider'>
            CONTACT
          </span>
        </motion.div>

        {/* Logo - Centered */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex items-center justify-center h-full flex-1"
        >
          <a
            ref={logoRef}
            href="#"
            onClick={handleLogoClick}
            className="flex items-center group cursor-pointer h-full"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 blur-md group-hover:blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative z-10 p-1 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-500">
                <img
                  src={logo}
                  alt="Ahmet Alp Samur Logo"
                  className="h-15 md:h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </a>
        </motion.div>

        {/* Right MENU button */}
        <div className="flex items-center justify-end h-full flex-1">
          <button
            className="text-white focus:outline-none z-50 flex items-center gap-2 h-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="font-[PowerGrotesk] text-1xl sm:text-3xl uppercase tracking-wider">MENU</span>
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
            </div>
          </button>
        </div>

        {/* Menu (Mobile & Desktop Shared) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black/95 backdrop-blur-lg pt-20 z-40 flex items-center justify-center"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              <div className="w-full max-w-2xl">
                <motion.ul className="flex flex-col items-center space-y-6 px-5">
                  {navItems.map(({ path, name }, index) => (
                    <motion.li
                      key={path}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-full text-center"
                    >
                      <Link
                        to={path}
                        className={`text-4xl md:text-5xl font-[PowerGrotesk] font-medium uppercase px-5 py-3 rounded-full transition-all duration-300 block
                          ${location.pathname === path ? 'bg-white text-black' : 'text-white/70 hover:text-white'}
                        `}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {name}
                        <span className="text-sm md:text-base font-mono ml-2">({String(index).padStart(2, '0')})</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div className="px-0 w-full" variants={itemVariants}>
                  <Threads amplitude={1.2} distance={0.4} enableMouseInteraction={true} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
