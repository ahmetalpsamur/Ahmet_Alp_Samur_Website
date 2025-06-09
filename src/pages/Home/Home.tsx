import React, { useEffect, useRef, useState, useCallback } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import Header from "../../components/Header/Header";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import backgroundImage from "../../assets/Photo/Background/background-black.jpg";
// Social Icons
import { FaLinkedin, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";

gsap.registerPlugin(TextPlugin);

const Home = () => {
  const nameRef = useRef(null);
  const cursorRef = useRef(null);
  const titleRef = useRef(null);
  const [init, setInit] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // tsParticles başlatma
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles container loaded", container);
  }, []);

  useEffect(() => {
    gsap.to(nameRef.current, {
      duration: 2,
      text: "AHMET ALP SAMUR",
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.7,
      delay: 2,
    });

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 2, ease: "power2.out" }
    );
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => {
        console.error('Kopyalama başarısız:', err);
      });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Particles arka plan - EN ALT KATMAN */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            fullScreen: {
              enable: true,
              zIndex: 5,
            },
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 3,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 70,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Arka plan resmi ve overlay - ORTA KATMAN */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>

      {/* İçerik - EN ÜST KATMAN */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex flex-1 flex-col justify-center items-center px-4 text-center pt-0">
          <h1
            ref={nameRef}
            className="text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-tight select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              textShadow: "0 0 30px rgba(255,255,255,0.05)",
            }}
          ></h1>

          <span
            ref={cursorRef}
            className="inline-block w-[6px] h-14 bg-white ml-1"
            style={{
              boxShadow: "0 0 10px rgba(255,255,255,0.7)",
            }}
          ></span>

          <p
            ref={titleRef}
            className="mt-8 text-sm md:text-base tracking-[0.4em] uppercase text-white/60 font-light"
          >
            Full-Stack Developer
          </p>

          <div className="max-w-xl mt-10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              <span className="text-white">Merhaba</span>{" "}
              <span className="text-white/50">—</span> <br className="md:hidden" />
              dijital evrenime hoş geldiniz.
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Sadelik, estetik ve teknolojiyle; zarif dijital deneyimler geliştiriyorum.
            </p>
          </div>

          {/* Sosyal Medya Butonları - Ultra Modern Tasarım */}
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

            {/* LeetCode (isteğe bağlı) */}
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

      {/* Kopyalama Bildirimi */}
      {copiedText && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-out">
          <SiGmail className="mr-2" />
          <span>Kopyalandı: <strong>{copiedText}</strong></span>
        </div>
      )}
    </div>
  );
};

export default Home;