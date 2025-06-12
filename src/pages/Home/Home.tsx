import { useEffect, useRef, useState, useCallback } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container } from "@tsparticles/engine";
import Header from "../../components/Header/Header";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import backgroundImage from "../../assets/Photo/Background/background-black.jpg";
// Social Icons
import { FaLinkedin, FaGithub, FaInstagram} from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";

import CircularText from "../../components/CircularText";


gsap.registerPlugin(TextPlugin);

const Home = () => {
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
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power2.out" }
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

        <div className="flex flex-1 flex-col justify-center items-center px-4 text-center pt-20">

          <p
            ref={titleRef}
            className="text-sm md:text-base tracking-[0.4em] uppercase text-white/60 font-light"
          >
            Full-Stack Developer
          </p>

          <div className="max-w-xl mt-10">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              <span className="font-power text-white">MERHABA</span>{" "}
              <span className="font-[PowerGrotesk] text-white">MERHABA</span>
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

<div className="fixed right-6 bottom-6 z-20">
  <div className="w-40 h-40 md:w-48 md:h-48 relative">
    <CircularText
      text="CONTACT•CONTACT•CONTACT•"
      spinDuration={30}
      onHover="speedUp"
      radius={70} // Yarıçapı ayarlayabilirsiniz
      className="text-white"
    />
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