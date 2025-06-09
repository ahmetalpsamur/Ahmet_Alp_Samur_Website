import React, { useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import backgroundImage from "../../assets/Photo/Background/background-anathema.jpg";

gsap.registerPlugin(TextPlugin);

const Home = () => {
  const nameRef = useRef(null);
  const cursorRef = useRef(null);
  const titleRef = useRef(null);

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

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="absolute inset-0 z-0">
        {/* Arka plan resmi ve overlay */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Resmin üzerine koyu overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
        
        {/* Grid efekti (isteğe bağlı) */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Ana içerik container'ını header'ın hemen altına yerleştiriyoruz */}
        <div className="flex flex-1 flex-col justify-center items-center px-4 text-center pt-0"> {/* pt-0 ekledik */}
          {/* İsim */}
          <h1
            ref={nameRef}
            className="text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-tight select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              textShadow: "0 0 30px rgba(255,255,255,0.05)",
            }}
          ></h1>

          {/* İmleç */}
          <span
            ref={cursorRef}
            className="inline-block w-[6px] h-14 bg-white ml-1"
            style={{
              boxShadow: "0 0 10px rgba(255,255,255,0.7)",
            }}
          ></span>

          {/* Alt başlık */}
          <p
            ref={titleRef}
            className="mt-8 text-sm md:text-base tracking-[0.4em] uppercase text-white/60 font-light"
          >
            Digital Experience Architect
          </p>

          {/* Giriş cümlesi */}
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

          {/* Buton */}
          <button className="mt-10 px-6 py-3 text-sm font-medium border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-colors duration-300">
            Keşfetmeye Başla
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;