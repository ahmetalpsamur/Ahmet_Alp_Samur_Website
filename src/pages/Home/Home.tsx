import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { FiArrowUpRight, FiMail } from "react-icons/fi";

import Header from "../../components/Header/Header";
import ContactModal from "../../components/Lanyard/ContactModal";
import homePortrait from "../../assets/Photo/ahmetalpsamur_home_resized.jpg";

gsap.registerPlugin(TextPlugin);

const Home = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  useEffect(() => {
    const intro = gsap.timeline({ delay: 0.35 });

    intro
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .fromTo(
        detailsRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.45"
      );

    return () => {
      intro.kill();
    };
  }, []);

  const toggleContactModal = () => {
    setIsContactModalVisible((isVisible) => !isVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-10"
      />

      <Header
        isContactActive={isContactModalVisible}
        onContactClick={toggleContactModal}
      />

      <ContactModal
        isVisible={isContactModalVisible}
        onClose={toggleContactModal}
        onCopy={copyToClipboard}
        copiedText={copiedText}
      />

      <main
        aria-hidden={isContactModalVisible}
        className={`relative z-10 mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-hidden px-4 text-center transition-opacity duration-300 sm:px-6 ${
          isContactModalVisible ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div
          ref={titleRef}
          className="relative z-20 flex flex-col items-center"
        >
          <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.34em] text-white/45 sm:text-[10px]">
            Designer in mind · Developer at heart
          </span>
          <h1 className="bg-white px-4 py-1 font-[PowerGrotesk] text-3xl leading-tight text-black sm:px-5 sm:text-4xl md:text-5xl">
            Hi, I'm AHMET ALP
          </h1>
          <p className="mt-1 font-serif text-base italic text-white/80 sm:text-lg md:text-xl">
            Full-Stack Developer
          </p>
        </div>

        <div
          ref={detailsRef}
          className="absolute inset-x-4 bottom-4 z-30 grid grid-cols-2 items-end gap-x-4 gap-y-3 sm:inset-x-6 sm:bottom-6 lg:grid-cols-[230px_auto_230px] lg:gap-x-6"
        >
          <div className="col-start-1 row-start-2 min-w-0 text-left lg:row-start-1 lg:max-w-[230px]">
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 sm:text-[9px] lg:mb-4 lg:gap-3 lg:text-[10px] lg:tracking-[0.22em]">
              <span>00</span>
              <span className="h-px flex-1 bg-white/20" />
              <span>HOME</span>
            </div>
            <p className="text-[10px] leading-snug text-white/70 sm:text-xs lg:text-sm lg:leading-relaxed">
              I build thoughtful digital products from interface to infrastructure.
            </p>
          </div>

          <nav
            aria-label="Home page shortcuts"
            className="col-span-2 col-start-1 row-start-1 flex w-full items-center justify-center gap-2 lg:col-span-1 lg:col-start-2 lg:w-auto"
          >
            <Link
              to="/about"
              className="group flex min-w-[128px] items-center justify-between gap-4 rounded-full border border-white/20 bg-black/45 px-4 py-3 text-left backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white hover:text-black sm:min-w-[150px]"
            >
              <span>
                <span className="block font-mono text-[8px] uppercase tracking-[0.2em] opacity-50">
                  Get to know
                </span>
                <span className="font-[PowerGrotesk] text-sm uppercase tracking-wider">
                  About me
                </span>
              </span>
              <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/projects"
              className="group flex min-w-[128px] items-center justify-between gap-4 rounded-full bg-white px-4 py-3 text-left text-black transition-colors hover:bg-white/80 sm:min-w-[150px]"
            >
              <span>
                <span className="block font-mono text-[8px] uppercase tracking-[0.2em] opacity-50">
                  Explore
                </span>
                <span className="font-[PowerGrotesk] text-sm uppercase tracking-wider">
                  My work
                </span>
              </span>
              <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </nav>

          <div className="col-start-2 row-start-2 min-w-0 text-right lg:col-start-3 lg:row-start-1 lg:w-[230px]">
            <div className="mb-1.5 flex items-center justify-end gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/55 sm:text-[9px] lg:mb-4 lg:gap-2 lg:text-[10px] lg:tracking-[0.18em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to new ideas
            </div>
            <button
              type="button"
              onClick={toggleContactModal}
              className="group ml-auto flex items-center gap-1.5 text-[10px] text-white/70 transition-colors hover:text-white sm:text-xs lg:gap-2 lg:text-sm"
            >
              <FiMail />
              <span className="border-b border-white/25 pb-0.5 group-hover:border-white">
                Let's create something
              </span>
            </button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-52 bg-gradient-to-t from-black via-black/55 to-transparent lg:hidden"
        />

        <img
          src={homePortrait}
          alt="Ahmet Alp Samur"
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[calc(100%-4.7rem)] w-[125vw] max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[calc(100%-5.5rem)] sm:w-[min(92vw,900px)]"
          loading="eager"
          fetchPriority="high"
        />
      </main>
    </div>
  );
};

export default Home;
