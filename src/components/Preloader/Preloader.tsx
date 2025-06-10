import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from '../../components/CountUpProps';
import logo from "../../assets/Logo/ahmetalpsamur_logo.png";
import sucess from "../../assets/Video/cat_sucess_gif.gif";

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const nextProgress = prev + 1;
                if (nextProgress >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    return 100;
                }
                return nextProgress;
            });
        }, 10); // 30ms * 100 = 3000ms (3 saniye)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800); // %100 olduktan sonra 0.8s daha bekler

            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    return (
        <AnimatePresence>
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
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                rotate: {
                                    repeat: Infinity,
                                    duration: 4,
                                    ease: "linear"
                                },
                                scale: {
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut"
                                }
                            }}
                            className="absolute w-48 h-48 border border-white/10 rounded-full"
                        />

                        {/* İç Halo */}
                        <motion.div
                            animate={{
                                rotate: -360,
                                scale: [0.9, 1, 0.9]
                            }}
                            transition={{
                                rotate: {
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "linear"
                                },
                                scale: {
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }
                            }}
                            className="absolute w-40 h-40 border border-white/5 rounded-full"
                        />

                        {/* Logo */}
                {/* Logo */}
<motion.img
    src={logo}
    alt="Ahmet Alp Samur Logo"
    className="w-28 h-28 z-20 object-contain"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{
        scale: 1,
        opacity: 1,
        rotate: 360,
        y: [0, -5, 0],
    }}
    transition={{
        rotate: {
            repeat: Infinity,
            duration: 2,
            ease: "linear",
        },
        scale: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
        y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
        opacity: {
            duration: 0.6,
        },
    }}
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
    <CountUp
        from={0}
        to={100}
        duration={0.1}
        className="text-4xl sm:text-8xl font-[PowerGrotesk] font-medium"
    />
    <span className="font-[PowerGrotesk] text-2xl sm:text-4xl mb-1 sm:mb-2">%</span>
</div>
                    </motion.div>

                    {/* Tamamlandığında "Ready" yazısı */}
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