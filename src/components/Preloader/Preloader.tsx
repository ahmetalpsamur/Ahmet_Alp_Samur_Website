import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import logo from "../../assets/Logo/ahmetalpsamur_logo.png";
import sucess from "../../assets/Video/cat_sucess_gif.gif";

interface PreloaderProps {
    onDone?: () => void;
}

// Gerçek asset yüklemesi çok hızlı biterse bile ekranda kalacak minimum süre (ms)
const MIN_VISIBLE_DURATION = 1200;

const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });

const Preloader = ({ onDone }: PreloaderProps) => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const assetsReadyRef = useRef(false);
    const prefersReducedMotion = useReducedMotion();

    // Gerçek assetleri (logo, success gif, font) arka planda yükle
    useEffect(() => {
        let cancelled = false;
        const fontPromise = document.fonts
            ? document.fonts.load('16px PowerGrotesk').catch(() => undefined)
            : Promise.resolve();

        Promise.all([preloadImage(logo), preloadImage(sucess), fontPromise]).then(() => {
            if (!cancelled) assetsReadyRef.current = true;
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // İlerleme: gerçek assetler hazır OLANA ve minimum süre dolana kadar %100'e ulaşmaz
    useEffect(() => {
        const startedAt = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const timeProgress = Math.min(100, (elapsed / MIN_VISIBLE_DURATION) * 100);

            if (elapsed >= MIN_VISIBLE_DURATION && assetsReadyRef.current) {
                setProgress(100);
                setIsComplete(true);
                clearInterval(interval);
                return;
            }

            setProgress(Math.floor(timeProgress));
        }, 30);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500); // %100'ün görünür kalması için kısa bir bekleme

            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    const outerHaloAnimate = prefersReducedMotion
        ? undefined
        : { rotate: 360, scale: [1, 1.05, 1] };
    const outerHaloTransition = prefersReducedMotion
        ? undefined
        : {
              rotate: { repeat: Infinity, duration: 4, ease: "linear" },
              scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
          };

    const innerHaloAnimate = prefersReducedMotion
        ? undefined
        : { rotate: -360, scale: [0.9, 1, 0.9] };
    const innerHaloTransition = prefersReducedMotion
        ? undefined
        : {
              rotate: { repeat: Infinity, duration: 3, ease: "linear" },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          };

    const logoAnimate = prefersReducedMotion
        ? { scale: 1, opacity: 1 }
        : { scale: 1, opacity: 1, rotate: 360, y: [0, -5, 0] };
    const logoTransition = prefersReducedMotion
        ? { scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.6 } }
        : {
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.6 },
          };

    return (
        <AnimatePresence onExitComplete={onDone}>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        }
                    }}
                >
                    {/* Logo ve Halo Efektleri */}
                    <div className="relative flex-1 flex items-center justify-center w-full">
                        {/* Dış Halo */}
                        <motion.div
                            animate={outerHaloAnimate}
                            transition={outerHaloTransition}
                            className="absolute w-48 h-48 border border-white/10 rounded-full"
                        />

                        {/* İç Halo */}
                        <motion.div
                            animate={innerHaloAnimate}
                            transition={innerHaloTransition}
                            className="absolute w-40 h-40 border border-white/5 rounded-full"
                        />

                        {/* Logo */}
                        <motion.img
                            src={logo}
                            alt="Ahmet Alp Samur Logo"
                            className="w-28 h-28 z-20 object-contain"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={logoAnimate}
                            transition={logoTransition}
                        />
                    </div>

                    {/* Progress Bar */}
                    <motion.div
                        className="w-[40%] sm:max-w-md h-px bg-white/10 mb-12 relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.div
                            className="absolute left-0 top-0 h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        >
                            <div className="absolute right-0 top-0 h-full w-1 bg-white blur-sm" />
                        </motion.div>
                    </motion.div>

                    {/* Sayaç */}
                    <motion.div
                        className="absolute left-8 bottom-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}

                    >
                        <div className="text-white font-mono flex items-end">
                            <span className="text-4xl sm:text-8xl font-[PowerGrotesk] font-medium tabular-nums">
                                {progress}
                            </span>
                            <span className="font-[PowerGrotesk] text-2xl sm:text-4xl mb-1 sm:mb-2">%</span>
                        </div>
                    </motion.div>

                    {/* Tamamlandığında "Success" GIF gösterimi */}
                    {isComplete && (
                        <motion.img
                            src={sucess}
                            alt="Success GIF"
                            className="w-32 h-32 object-contain absolute top-3/4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
