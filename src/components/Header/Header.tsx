import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight, FiPhone, FiRefreshCw } from "react-icons/fi";

import logo from "../../assets/Logo/ahmetalpsamur_logo.png";
import Threads from "./Thread";
import GravityMenu from "./GravityMenu";
import gravgunInset from "../../assets/Photo/Half-life/gravgun-inset.png";
import gravgunHover from "../../assets/Photo/Half-life/gravgun-hover.png";

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
  isContactActive?: boolean;
  onContactClick?: () => void;
}

type NavItem = {
  name: string;
  path?: string;
  label: string;
  kind?: "contact" | "soon";
};

const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/",
    label: "Start here",
  },
  {
    name: "About",
    path: "/about",
    label: "My timeline",
  },
  {
    name: "Projects",
    path: "/projects",
    label: "Selected work",
  },
  {
    name: "Contact",
    label: "Say hello",
    kind: "contact",
  },
  {
    name: "Blog",
    label: "Coming soon",
    kind: "soon",
  },
  {
    name: "Lost",
    path: "/lost",
    label: "Enter the unknown",
  },
];

const Header = ({
  isContactActive = false,
  onContactClick,
}: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const logoTimerRef = useRef<number | null>(null);
  const headerRowRef = useRef<HTMLDivElement>(null);
  const menuBodyRef = useRef<HTMLDivElement>(null);
  // Stable identity: a fresh array each render would rebuild the physics world.
  const gravityRoots = useMemo(() => [headerRowRef, menuBodyRef], []);
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = Math.max(
    navItems.findIndex((item) => item.path === location.pathname),
    0
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoTransitioning, setIsLogoTransitioning] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(currentIndex);
  const [isGravityMode, setIsGravityMode] = useState(false);
  const [gravityResetSignal, setGravityResetSignal] = useState(0);
  const [isGravityResetting, setIsGravityResetting] = useState(false);

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

  useEffect(() => {
    if (!isMenuOpen) {
      setIsGravityMode(false);
      setIsGravityResetting(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (isGravityMode) {
        setIsGravityResetting(false);
        setIsGravityMode(false);
        return;
      }

      setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isGravityMode, isMenuOpen]);

  useEffect(
    () => () => {
      if (logoTimerRef.current !== null) {
        window.clearTimeout(logoTimerRef.current);
      }
    },
    [],
  );

  const handleContactClick = () => {
    setIsMenuOpen(false);

    if (onContactClick) {
      onContactClick();
      return;
    }

    window.location.href = "mailto:ahmetalpsamur@gmail.com";
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (isLogoTransitioning) return;

    setIsMenuOpen(false);
    setIsLogoTransitioning(true);

    logoTimerRef.current = window.setTimeout(() => {
      setIsLogoTransitioning(false);
      navigate("/");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 520);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full flex-none px-2 transition-all duration-500 sm:px-5"
    >
      <AnimatePresence>
        {isLogoTransitioning && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[45] bg-white mix-blend-difference motion-reduce:hidden"
            initial={{ clipPath: "circle(0px at 50% 3.5rem)" }}
            animate={{ clipPath: "circle(150vmax at 50% 3.5rem)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>

      <div
        ref={headerRowRef}
        className="relative z-50 mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center"
      >
        <motion.button
          type="button"
          data-gravity
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleContactClick}
          aria-pressed={isContactActive}
          className={`relative flex items-center justify-self-start gap-2 rounded-full border px-2 py-1 transition-[background-color,border-color,color,box-shadow] duration-500 sm:px-3 sm:py-1.5 ${
            isContactActive
              ? "border-white bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_30px_rgba(255,255,255,0.12)]"
              : "border-white/0 text-white hover:border-white/20 hover:bg-white/[0.04]"
          }`}
        >
          <motion.span
            animate={{ rotate: isContactActive ? 0 : 135 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative isolate rounded-full p-1"
          >
            <AnimatePresence initial={false}>
              {isContactActive && (
                <motion.span
                  key="phone-signal"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.28 }}
                  className="pointer-events-none absolute bottom-[57%] left-[62%] z-20 h-7 w-7 text-current sm:h-9 sm:w-9"
                >
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    className="h-full w-full overflow-visible motion-reduce:hidden"
                  >
                    {[
                      { path: "M2 24 A6 6 0 0 1 8 30", delay: 0 },
                      { path: "M2 18 A12 12 0 0 1 14 30", delay: 0.22 },
                      { path: "M2 10 A20 20 0 0 1 22 30", delay: 0.44 },
                    ].map(({ path, delay }) => (
                      <motion.path
                        key={path}
                        d={path}
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: [0, 1, 1],
                          opacity: [0, 0.85, 0],
                        }}
                        transition={{
                          duration: 1.35,
                          delay,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
            <FiPhone className="relative z-10 text-xl text-current transition-all duration-300 sm:text-3xl" />
          </motion.span>
          <span className="font-[PowerGrotesk] text-xl uppercase tracking-wider sm:text-3xl">
            Contact
          </span>
          <AnimatePresence initial={false}>
            {isContactActive && (
              <motion.span
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ delay: 0.32, duration: 0.3 }}
                className="absolute left-3 top-[calc(100%+0.2rem)] flex items-center gap-1.5 whitespace-nowrap font-mono text-[6px] font-normal uppercase tracking-[0.18em] text-white/50 sm:text-[7px]"
              >
                <span className="h-px w-3 bg-white/40" />
                Signal connected
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.div
          data-gravity
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex items-center justify-center"
        >
          <Link
            ref={logoRef}
            to="/"
            onClick={handleLogoClick}
            className="group relative flex items-center"
            aria-label="Go to home page"
          >
            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 blur-md transition-all duration-500 group-hover:bg-white/20 group-hover:opacity-100 group-hover:blur-lg" />
            <motion.span
              initial="rest"
              animate={isLogoTransitioning ? "active" : "rest"}
              whileHover={isLogoTransitioning ? undefined : "hover"}
              className="relative z-10 rounded-full border border-white/10 p-1 transition-colors duration-500 group-hover:border-white/25"
            >
              <img
                src={logo}
                alt="Ahmet Alp Samur"
                className="h-15 w-auto opacity-0 md:h-20"
              />
              <motion.img
                src={logo}
                alt=""
                aria-hidden="true"
                variants={{
                  rest: { x: 0, rotate: 0, scale: 1 },
                  hover: { x: -2, rotate: -1.5, scale: 1.025 },
                  active: { x: -7, rotate: -4, scale: 1.04 },
                }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                style={{ clipPath: "inset(0 50% 0 0)" }}
                className="pointer-events-none absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain"
              />
              <motion.img
                src={logo}
                alt=""
                aria-hidden="true"
                variants={{
                  rest: { x: 0, rotate: 0, scale: 1 },
                  hover: { x: 2, rotate: 1.5, scale: 1.025 },
                  active: { x: 7, rotate: 4, scale: 1.04 },
                }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                style={{ clipPath: "inset(0 0 0 50%)" }}
                className="pointer-events-none absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] object-contain"
              />
            </motion.span>
          </Link>
        </motion.div>

        <motion.button
          type="button"
          data-gravity
          whileTap={{ scale: 0.96 }}
          className={`relative z-50 flex items-center justify-self-end gap-2 rounded-full border px-2 py-1 transition-[background-color,border-color,color,box-shadow] duration-500 focus:outline-none sm:px-3 sm:py-1.5 ${
            isMenuOpen
              ? "border-white bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_30px_rgba(255,255,255,0.12)]"
              : "border-white/0 text-white hover:border-white/20 hover:bg-white/[0.04]"
          }`}
          onClick={() => {
            setPreviewIndex(currentIndex);
            setIsMenuOpen((isOpen) => !isOpen);
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-pressed={isMenuOpen}
          aria-controls="primary-menu"
        >
          <span className="font-[PowerGrotesk] text-xl uppercase tracking-wider sm:text-3xl">
            {isMenuOpen ? "Close" : "Menu"}
          </span>
          <span className="flex w-6 flex-col items-end space-y-1.5" aria-hidden="true">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-4"}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"}`} />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="primary-menu"
            className="fixed inset-0 z-40 overflow-hidden bg-black text-white"
            initial={{
              clipPath: "circle(0px at calc(100% - 2.5rem) 2.5rem)",
            }}
            animate={{
              clipPath: "circle(150vmax at calc(100% - 2.5rem) 2.5rem)",
            }}
            exit={{
              clipPath: "circle(0px at calc(100% - 2.5rem) 2.5rem)",
            }}
            transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:22px_22px] opacity-20"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-45">
              <Threads amplitude={1.1} distance={0.35} enableMouseInteraction />
            </div>

            <div
              ref={menuBodyRef}
              className="relative z-10 mx-auto grid h-full max-w-7xl grid-rows-[1fr] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 md:pt-24 lg:px-8"
            >
              <div className="flex min-h-0 items-start justify-center pt-2 md:pt-3">
                <nav
                  aria-label="Primary navigation"
                  onMouseLeave={() => setPreviewIndex(currentIndex)}
                  className="relative max-h-full min-h-0 w-full max-w-4xl overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div data-gravity className="mb-3 flex items-center justify-between border-b border-white/15 pb-2 font-mono text-[8px] uppercase tracking-[0.22em] text-white/35 md:hidden">
                    <span>Navigation</span>
                    <span>{String(previewIndex).padStart(2, "0")} · {String(navItems.length).padStart(2, "0")}</span>
                  </div>
                  <div data-gravity className="mb-3 hidden items-center justify-between border-b border-white/15 pb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35 md:flex">
                    <span>Navigation</span>
                    <span>{String(previewIndex).padStart(2, "0")} / {String(navItems.length).padStart(2, "0")}</span>
                  </div>
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
                    }}
                    className="flex flex-col gap-0.5 sm:gap-1"
                  >
                    {navItems.map((item, index) => {
                      const isCurrent = item.path === location.pathname;
                      const isSoon = item.kind === "soon";
                      const itemClassName = `group relative flex w-full items-center justify-between overflow-hidden border border-transparent px-4 py-1 text-left sm:px-6 sm:py-1.5 lg:px-8 ${
                        isSoon ? "cursor-default" : "cursor-pointer"
                      }`;
                      const itemContent = (
                        <>
                          {isCurrent && (
                            <motion.span
                              layoutId="active-menu-page"
                              className="absolute inset-0 bg-white"
                              transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            />
                          )}
                          <span className="relative z-10 flex min-w-0 flex-col transition-transform duration-300 group-hover:translate-x-2">
                            <span
                              style={{
                                fontSize:
                                  "clamp(1.9rem, min(4.4vw, 8vh), 4.25rem)",
                              }}
                              className={`font-[PowerGrotesk] uppercase leading-[0.92] tracking-[-0.04em] transition-colors duration-300 ${
                                isCurrent ? "text-black" : isSoon ? "text-white/25" : "text-white/65 group-hover:text-white"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className={`mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] md:hidden ${
                              isCurrent ? "text-black/45" : "text-white/30"
                            }`}>
                              {item.label}
                            </span>
                          </span>
                          <span className={`relative z-10 flex items-center gap-2 font-mono text-[9px] sm:text-xs ${
                            isCurrent ? "text-black/55" : "text-white/35"
                          }`}>
                            {isSoon ? "SOON" : `(${String(index).padStart(2, "0")})`}
                            {!isSoon && (
                              <FiArrowUpRight className="hidden text-base opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                            )}
                          </span>
                          {isCurrent && (
                            <motion.span
                              initial={{ width: 0 }}
                              animate={{ width: `${((index + 1) / navItems.length) * 100}%` }}
                              transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
                              className="absolute bottom-0 left-0 z-10 h-px bg-black/35 md:hidden"
                            />
                          )}
                        </>
                      );

                      return (
                        <motion.li
                          key={item.name}
                          data-gravity
                          variants={{
                            hidden: { opacity: 0, x: -28 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          onMouseEnter={() => setPreviewIndex(index)}
                          onFocus={() => setPreviewIndex(index)}
                          className="border-b border-white/[0.08] last:border-b-0"
                        >
                          {item.path ? (
                            <Link
                              to={item.path}
                              onClick={closeMenu}
                              aria-label={item.name}
                              aria-current={isCurrent ? "page" : undefined}
                              className={itemClassName}
                            >
                              {itemContent}
                            </Link>
                          ) : item.kind === "contact" ? (
                            <button
                              type="button"
                              onClick={handleContactClick}
                              className={itemClassName}
                            >
                              {itemContent}
                            </button>
                          ) : (
                            <div aria-disabled="true" className={itemClassName}>
                              {itemContent}
                            </div>
                          )}
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </nav>

              </div>

            </div>

            <AnimatePresence>
              {isGravityMode && (
                <GravityMenu
                  roots={gravityRoots}
                  resetSignal={gravityResetSignal}
                  onResettingChange={setIsGravityResetting}
                />
              )}
            </AnimatePresence>

            <div className="absolute bottom-16 left-4 z-[35] sm:bottom-20 sm:left-6 lg:left-8">
              <div className="relative h-11 w-[4.5rem]">
              <button
                type="button"
                onClick={() => {
                  setIsGravityResetting(false);
                  setIsGravityMode((isOn) => !isOn);
                }}
                aria-pressed={isGravityMode}
                aria-label={
                  isGravityMode ? "Holster gravity gun" : "Equip gravity gun"
                }
                title={isGravityMode ? "Holster gravity gun" : "Equip gravity gun"}
                className={`group relative flex h-11 w-[4.5rem] items-center justify-center overflow-hidden rounded-md border transition-[border-color,background-color,box-shadow] duration-300 ${
                  isGravityMode
                    ? "border-amber-400/60 bg-amber-400/[0.07] shadow-[0_0_24px_rgba(255,150,40,0.28)]"
                    : "border-white/15 hover:border-white/40"
                }`}
              >
                <img
                  src={gravgunInset}
                  alt=""
                  aria-hidden="true"
                  className={`absolute w-14 object-contain transition-opacity duration-300 ${
                    isGravityMode ? "opacity-0" : "opacity-40 group-hover:opacity-0"
                  }`}
                />
                <img
                  src={gravgunHover}
                  alt=""
                  aria-hidden="true"
                  className={`absolute w-14 object-contain transition-opacity duration-300 ${
                    isGravityMode
                      ? "opacity-100 drop-shadow-[0_0_10px_rgba(255,150,40,0.75)]"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {isGravityMode && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() =>
                      setGravityResetSignal((signal) => signal + 1)
                    }
                    disabled={isGravityResetting}
                    aria-label="Reset gravity scene"
                    className="absolute left-[calc(100%+0.5rem)] top-1/2 flex h-9 w-24 -translate-y-1/2 items-center justify-center gap-2 rounded-md border border-amber-300/25 bg-black/70 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-100/60 shadow-[0_0_18px_rgba(255,145,40,0.1)] backdrop-blur-md transition-colors hover:border-amber-300/55 hover:text-amber-50 disabled:cursor-wait disabled:opacity-45"
                  >
                    <FiRefreshCw
                      className={isGravityResetting ? "animate-spin" : ""}
                    />
                    <span>{isGravityResetting ? "Resetting" : "Reset"}</span>
                  </motion.button>
                )}
              </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {isGravityMode && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                  className="pointer-events-none absolute bottom-5 left-1/2 z-[35] hidden -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200/10 bg-black/55 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-100/35 backdrop-blur-md sm:flex"
                >
                  <span>Drag to throw</span>
                  <span className="text-amber-300/25">/</span>
                  <span>Right click to punt</span>
                  <span className="text-amber-300/25">/</span>
                  <span>Esc to exit</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
