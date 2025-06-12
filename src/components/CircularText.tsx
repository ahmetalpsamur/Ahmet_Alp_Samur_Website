import React, { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
  className?: string;
  radius?: number;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  radius = 40, // Yarıçap parametresi eklendi
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  // Animasyon kontrolü
  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      transition: {
        duration: spinDuration,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, [spinDuration, controls, rotation]);

  const handleHoverStart = () => {
    switch (onHover) {
      case "slowDown":
        controls.start({ rotate: 360, transition: { duration: spinDuration * 2, ease: "linear" } });
        break;
      case "speedUp":
        controls.start({ rotate: 360, transition: { duration: spinDuration / 3, ease: "linear" } });
        break;
      case "pause":
        controls.stop();
        break;
      case "goBonkers":
        controls.start({ 
          rotate: 360,
          transition: { 
            duration: spinDuration / 10,
            repeat: Infinity,
            ease: "linear"
          }
        });
        break;
    }
  };

  const handleHoverEnd = () => {
    const currentRotation = rotation.get();
    controls.start({
      rotate: currentRotation + 360,
      transition: {
        duration: spinDuration,
        repeat: Infinity,
        ease: "linear"
      }
    });
  };

  return (
    <motion.div
      className={`relative w-full h-full ${className}`}
      style={{ rotate: rotation }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, index) => {
        const angle = (index * 360) / letters.length;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        return (
          <motion.span
            key={index}
            className="absolute text-xs md:text-sm font-medium text-white"
            style={{
              left: '50%',
              top: '50%',
              x: x,
              y: y,
              rotate: angle + 90, // Harfleri dairesel yöne doğru döndür
              transformOrigin: '0 0',
            }}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;    