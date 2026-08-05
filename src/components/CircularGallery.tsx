import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

interface CircularGalleryProps {
  items: TimelineItem[];
}

const CircularGallery = ({ items }: CircularGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const wheelLockedRef = useRef(false);
  const dragStartRef = useRef<number | null>(null);

  const goTo = (nextIndex: number) => {
    if (!items.length) return;

    const boundedIndex = Math.min(Math.max(nextIndex, 0), items.length - 1);
    if (boundedIndex === activeIndex) return;

    setDirection(boundedIndex > activeIndex ? 1 : -1);
    setActiveIndex(boundedIndex);
  };

  const goPrevious = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  useEffect(() => {
    if (activeIndex > items.length - 1) {
      setActiveIndex(Math.max(items.length - 1, 0));
    }
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  const activeItem = items[activeIndex];
  const progress = items.length > 1
    ? (activeIndex / (items.length - 1)) * 100
    : 100;

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (wheelLockedRef.current || Math.abs(event.deltaY) < 8) return;

    wheelLockedRef.current = true;
    if (event.deltaY > 0) {
      goNext();
    } else {
      goPrevious();
    }
    window.setTimeout(() => {
      wheelLockedRef.current = false;
    }, 550);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;

    const distance = dragStartRef.current - event.clientX;
    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        goNext();
      } else {
        goPrevious();
      }
    }
    dragStartRef.current = null;
  };

  return (
    <section
      aria-label="Life timeline"
      aria-roledescription="carousel"
      tabIndex={0}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStartRef.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goPrevious();
        if (event.key === "ArrowRight") goNext();
      }}
      className="relative h-full w-full touch-pan-y select-none overflow-hidden outline-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.07),transparent_42%)]"
      />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={activeItem.year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45 }}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 font-[PowerGrotesk] text-[clamp(7rem,23vw,20rem)] leading-none tracking-[-0.08em] text-white/[0.035]"
        >
          {activeItem.year}
        </motion.span>
      </AnimatePresence>

      <div className="absolute inset-x-4 top-2 z-20 flex items-center justify-between sm:inset-x-6 lg:inset-x-10">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">
            About · Life in frames
          </p>
          <p className="mt-1 hidden text-xs text-white/55 sm:block">
            Scroll or drag to move through the years
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/45">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl items-center gap-4 px-4 pb-20 pt-10 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:pb-24 md:pt-14 lg:gap-16">
        <div className="relative mx-auto h-[min(32dvh,350px)] w-full max-w-xl sm:h-[min(38dvh,410px)] md:h-[min(55dvh,540px)]">
          <div className="absolute -inset-2 rotate-2 border border-white/10" />

          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.figure
              key={`${activeItem.year}-${activeIndex}`}
              custom={direction}
              variants={{
                enter: (moveDirection: number) => ({
                  opacity: 0,
                  x: moveDirection * 70,
                  rotate: moveDirection * 2,
                }),
                center: { opacity: 1, x: 0, rotate: 0 },
                exit: (moveDirection: number) => ({
                  opacity: 0,
                  x: moveDirection * -70,
                  rotate: moveDirection * -2,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-hidden bg-neutral-900"
            >
              <img
                src={activeItem.image}
                alt={activeItem.title}
                draggable={false}
                className="h-full w-full object-cover grayscale-[20%] transition duration-700 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
              <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                Memory {String(activeIndex + 1).padStart(2, "0")}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="relative text-left md:pr-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeItem.year}-${activeItem.title}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-2 flex items-center gap-3 sm:mb-4">
                <span className="font-mono text-xs tracking-[0.28em] text-white/45">
                  {activeItem.year}
                </span>
                <span className="h-px w-12 bg-white/25" />
              </div>
              <h1 className="font-[PowerGrotesk] text-3xl uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
                {activeItem.title}
              </h1>
              <p className="mt-3 max-w-md text-xs leading-relaxed text-white/60 sm:mt-5 sm:text-sm md:text-base">
                {activeItem.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-20 sm:inset-x-6 sm:bottom-6 lg:inset-x-10">
        <div className="mb-3 h-px w-full bg-white/10">
          <motion.div
            className="h-full bg-white"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between">
            {items.map((item, index) => (
              <button
                key={`${item.year}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${item.year}: ${item.title}`}
                aria-current={index === activeIndex ? "step" : undefined}
                className={`font-mono text-[8px] transition-colors sm:text-[9px] md:text-[10px] ${
                  index === activeIndex ? "text-white" : "text-white/30 hover:text-white/70"
                }`}
              >
                <span className="hidden sm:inline">{item.year}</span>
                <span
                  className={`block h-1.5 w-1.5 rounded-full sm:hidden ${
                    index === activeIndex ? "bg-white" : "bg-white/25"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="ml-3 flex gap-2 border-l border-white/15 pl-3">
            <button
              type="button"
              onClick={goPrevious}
              disabled={activeIndex === 0}
              aria-label="Previous memory"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-white sm:h-9 sm:w-9"
            >
              <FiArrowLeft />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === items.length - 1}
              aria-label="Next memory"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-white sm:h-9 sm:w-9"
            >
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularGallery;
