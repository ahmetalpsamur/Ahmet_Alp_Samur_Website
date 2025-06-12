import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FaCode, FaGraduationCap, FaBriefcase, FaBirthdayCake, FaLaptopCode } from "react-icons/fa";

// Timeline verileri
const timelineData = [
  {
    year: "2025 Aralık",
    side: "right",
    title: "Yeni Projeler",
    description: "Yapay zeka entegreli yeni nesil web uygulamaları geliştiriyorum.",
    icon: <FaCode className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2024 Haziran",
    side: "left",
    title: "İş Deneyimi",
    description: "Büyük ölçekli bir şirkette lead developer olarak çalışıyorum.",
    icon: <FaBriefcase className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2023 Ocak",
    side: "right",
    title: "Eğitim",
    description: "Yeni teknolojiler üzerine uzmanlık eğitimleri alıyorum.",
    icon: <FaGraduationCap className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2020 Eylül",
    side: "left",
    title: "Üniversite",
    description: "Bilgisayar Mühendisliği lisans eğitimimi tamamladım.",
    icon: <FaGraduationCap className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2018 Temmuz",
    side: "right",
    title: "Staj Dönemi",
    description: "Çeşitli şirketlerde staj yaparak tecrübe kazandım.",
    icon: <FaBriefcase className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2015 Ağustos",
    side: "left",
    title: "Lise",
    description: "Lise eğitimimi tamamladım ve üniversiteye hazırlandım.",
    icon: <FaGraduationCap className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2010 Eylül",
    side: "right",
    title: "Ortaokul",
    description: "Teknolojiye olan ilgim bu yıllarda başladı.",
    icon: <FaLaptopCode className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2006 Ocak",
    side: "left",
    title: "İlk Bilgisayar",
    description: "İlk bilgisayarıma kavuştum ve teknoloji dünyasını keşfetmeye başladım.",
    icon: <FaLaptopCode className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    year: "2002 Şubat",
    side: "right",
    title: "Doğum",
    description: "Dünyaya geldim ve hayat maceram başladı.",
    icon: <FaBirthdayCake className="text-2xl" />,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  }
];

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // GSAP ve ScrollTrigger'ı kaydet
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // Tüm timeline öğelerinin yüklendiğinden emin olmak için küçük bir gecikme ekliyoruz
    const timer = setTimeout(() => {
      if (!timelineRef.current) return;

      // Timeline animasyonları
      const timelineItems = gsap.utils.toArray(".timeline-item") as HTMLElement[];
      
      timelineItems.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
            markers: false
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out"
        });
      });

      // Çizgi animasyonu
      gsap.from(".timeline-line", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1
        },
        scaleY: 0,
        transformOrigin: "top center",
        duration: 2
      });

      // Nokta animasyonları
      gsap.from(".timeline-dot", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1
        },
        scale: 0,
        stagger: 0.1,
        duration: 0.5
      });

    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="about-page min-h-screen bg-black text-white pt-20 pb-40 px-4 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-20 text-center tracking-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
        >
          BENİM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">HİKAYEM</span>
        </motion.h1>
        
        <div ref={timelineRef} className="relative timeline-container">
          {/* Orta çizgi */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-white/50 to-transparent timeline-line"></div>
          
          {/* Timeline öğeleri */}
          <div className="space-y-32 md:space-y-40">
            {timelineData.map((item, index) => (
              <motion.div 
                key={index}
                className={`timeline-item relative flex ${item.side === "left" ? "justify-start" : "justify-end"}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`w-full md:w-[45%] relative ${item.side === "left" ? "md:mr-auto" : "md:ml-auto"}`}>
                  {/* Yıl gösterge */}
                  <motion.div 
                    className={`absolute top-0 ${item.side === "left" ? "right-0 md:right-auto md:left-0" : "left-0 md:left-auto md:right-0"} transform translate-x-1/2 md:translate-x-0 ${item.side === "left" ? "md:-translate-x-1/2" : "md:translate-x-1/2"} -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-white text-black z-20 shadow-lg timeline-dot`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-white bg-black p-2 rounded-full">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold mt-1">{item.year.split(" ")[0]}</span>
                    </div>
                  </motion.div>
                  
                  {/* İçerik kartı */}
                  <div className={`relative bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 overflow-hidden shadow-2xl ${item.side === "left" ? "md:mr-10" : "md:ml-10"} transition-all duration-300 hover:bg-white/10 hover:border-white/20`}>
                    {/* Glow efekti */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className={`absolute ${item.side === "left" ? "-left-10" : "-right-10"} -top-10 w-32 h-32 bg-white rounded-full filter blur-3xl opacity-10`}></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                      {item.side === "left" && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-48 object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{item.title}</h3>
                        <p className="text-white/80 leading-relaxed">{item.description}</p>
                        <div className="mt-4 flex items-center">
                          <span className="text-xs font-mono opacity-70">{item.year}</span>
                        </div>
                      </div>
                      
                      {item.side === "right" && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-48 object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;