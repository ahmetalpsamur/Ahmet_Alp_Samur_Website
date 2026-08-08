import { memo, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { SiGmail, SiLeetcode } from "react-icons/si";
import { FiCheck } from "react-icons/fi";
import type { IconType } from "react-icons";
import Lanyard from "./Lanyard";
import type { ScreenPoint } from "./Lanyard";
import ScrollVelocity from "../ScrollVelocity";

interface ContactModalProps {
  isVisible: boolean;
  isClosing: boolean;
  onClose: () => void;
  onClosed: () => void;
  onCopy: (text: string) => void;
  copiedText: string | null;
}

const emailAddress = "ahmetalpsamur@gmail.com";
const contactTitleTexts = ["CONTACT ME *"];
const ContactTitleMarquee = memo(ScrollVelocity);

const contactChannels: Array<{
  name: string;
  icon: IconType;
  href?: string;
  action?: "copy";
}> = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/ahmet-alp-samur/",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    href: "https://github.com/ahmetalpsamur",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/ahmetalpsamur/",
  },
  {
    name: "Email",
    icon: SiGmail,
    action: "copy",
  },
  {
    name: "LeetCode",
    icon: SiLeetcode,
    href: "https://leetcode.com/ahmetalpsamur/",
  },
];

interface ContactCablesProps {
  cardPointRef: { current: ScreenPoint | null };
  targets: HTMLElement[];
  isClosing: boolean;
}

interface CableCurve {
  controlOneX: number;
  controlOneY: number;
  controlTwoX: number;
  controlTwoY: number;
}

interface CardMotionTracker {
  lastPoint: ScreenPoint | null;
  lastTimestamp: number;
  stableSince: number;
  openedAt: number;
}

const signalProfiles = [
  { interval: 4300, duration: 1350, radius: 1.7 },
  { interval: 3400, duration: 950, radius: 1.5 },
  { interval: 4700, duration: 1650, radius: 1.8 },
  { interval: 5600, duration: 820, radius: 2.1 },
  { interval: 3800, duration: 1120, radius: 1.45 },
];

const ContactCables = ({
  cardPointRef,
  targets,
  isClosing,
}: ContactCablesProps) => {
  const glowPathRefs = useRef<Array<SVGPathElement | null>>([]);
  const corePathRefs = useRef<Array<SVGPathElement | null>>([]);
  const packetRefs = useRef<Array<SVGCircleElement | null>>([]);
  const cableCurvesRef = useRef<Array<CableCurve | null>>([]);
  const arrivedCycleRef = useRef<number[]>([]);
  const originGlowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    const startedAt = performance.now();
    let previousFrame = startedAt;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pulseTarget = (target: HTMLElement) => {
      if (reduceMotion) return;

      const icon = target.querySelector<HTMLElement>("[data-channel-icon]");
      icon?.animate(
        [
          {
            offset: 0,
            color: "rgba(255,255,255,0.65)",
            filter: "brightness(1) drop-shadow(0 0 1px rgba(255,255,255,0))",
          },
          {
            offset: 0.12,
            color: "rgba(255,255,255,0.88)",
            filter: "brightness(1.1) drop-shadow(0 0 3px rgba(255,255,255,0.4))",
          },
          {
            offset: 0.36,
            color: "rgba(255,255,255,1)",
            filter: "brightness(1.2) drop-shadow(0 0 5px rgba(255,255,255,0.68))",
          },
          {
            offset: 0.68,
            color: "rgba(255,255,255,0.82)",
            filter: "brightness(1.08) drop-shadow(0 0 2px rgba(255,255,255,0.3))",
          },
          {
            offset: 1,
            color: "rgba(255,255,255,0.65)",
            filter: "brightness(1) drop-shadow(0 0 1px rgba(255,255,255,0))",
          },
        ],
        { duration: 720, easing: "ease-in-out" },
      );
    };

    const updateCable = (now: number) => {
      animationFrame = window.requestAnimationFrame(updateCable);
      const start = cardPointRef.current;
      if (!start) return;

      const delta = Math.min(32, now - previousFrame);
      previousFrame = now;
      const curveFollow = 1 - Math.exp(-delta / 115);
      const elapsed = now - startedAt;

      if (originGlowRef.current) {
        originGlowRef.current.setAttribute("cx", start.x.toFixed(2));
        originGlowRef.current.setAttribute("cy", start.y.toFixed(2));
      }

      targets.forEach((target, index) => {
        if (!target.isConnected) return;

        const targetRect = target.getBoundingClientRect();
        const end = {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + 2,
        };
        const verticalDistance = Math.max(80, end.y - start.y);
        const horizontalDistance = end.x - start.x;
        const bend = (index - (targets.length - 1) / 2) * 18;
        const desiredCurve = {
          controlOneX: start.x + horizontalDistance * 0.12 + bend,
          controlOneY: start.y + verticalDistance * 0.34,
          controlTwoX: end.x - horizontalDistance * 0.08 + bend * 0.35,
          controlTwoY: end.y - verticalDistance * 0.28,
        };
        const currentCurve = cableCurvesRef.current[index] ?? desiredCurve;

        currentCurve.controlOneX +=
          (desiredCurve.controlOneX - currentCurve.controlOneX) * curveFollow;
        currentCurve.controlOneY +=
          (desiredCurve.controlOneY - currentCurve.controlOneY) * curveFollow;
        currentCurve.controlTwoX +=
          (desiredCurve.controlTwoX - currentCurve.controlTwoX) * curveFollow;
        currentCurve.controlTwoY +=
          (desiredCurve.controlTwoY - currentCurve.controlTwoY) * curveFollow;
        cableCurvesRef.current[index] = currentCurve;

        const path = [
          `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
          `C ${currentCurve.controlOneX.toFixed(2)} ${currentCurve.controlOneY.toFixed(2)}`,
          `${currentCurve.controlTwoX.toFixed(2)} ${currentCurve.controlTwoY.toFixed(2)}`,
          `${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
        ].join(" ");

        glowPathRefs.current[index]?.setAttribute("d", path);
        corePathRefs.current[index]?.setAttribute("d", path);

        const packet = packetRefs.current[index];
        const cablePath = corePathRefs.current[index];
        if (!packet || !cablePath) return;
        if (isClosing || reduceMotion) {
          packet.style.opacity = "0";
          return;
        }

        const profile = signalProfiles[index % signalProfiles.length];
        const firstLaunch = 720 + index * 145;
        const signalElapsed = elapsed - firstLaunch;
        if (signalElapsed < 0) {
          packet.style.opacity = "0";
          return;
        }

        const cycle = Math.floor(signalElapsed / profile.interval);
        const cycleTime = signalElapsed - cycle * profile.interval;
        if (cycleTime <= profile.duration) {
          const linearProgress = cycleTime / profile.duration;
          const progress = 1 - Math.pow(1 - linearProgress, 3);
          const point = cablePath.getPointAtLength(
            cablePath.getTotalLength() * progress,
          );
          packet.setAttribute("cx", point.x.toFixed(2));
          packet.setAttribute("cy", point.y.toFixed(2));
          packet.setAttribute("r", profile.radius.toString());
          packet.style.opacity = String(
            Math.min(1, linearProgress * 5, (1 - linearProgress) * 7),
          );

          const hasReachedTarget = Math.hypot(
            end.x - point.x,
            end.y - point.y,
          ) <= 2.5;
          if (hasReachedTarget && arrivedCycleRef.current[index] !== cycle) {
            arrivedCycleRef.current[index] = cycle;
            pulseTarget(target);
          }
        } else {
          packet.style.opacity = "0";
          if (arrivedCycleRef.current[index] !== cycle) {
            arrivedCycleRef.current[index] = cycle;
            pulseTarget(target);
          }
        }
      });
    };

    animationFrame = window.requestAnimationFrame(updateCable);
    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [cardPointRef, isClosing, targets]);

  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35] h-full w-full overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <defs>
        <filter id="contact-cable-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="contact-packet-glow" x="-400%" y="-400%" width="800%" height="800%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>
        {targets.map((target, index) => (
          <g key={target.dataset.contactChannel ?? index}>
            <motion.path
              ref={(node) => {
                glowPathRefs.current[index] = node;
              }}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              filter="url(#contact-cable-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isClosing
                  ? { pathLength: 0, opacity: 1 }
                  : { pathLength: 1, opacity: 1 }
              }
              transition={
                isClosing
                  ? {
                      pathLength: {
                        duration: 0.34,
                        delay: (targets.length - 1 - index) * 0.035,
                        ease: [0.64, 0, 0.78, 0],
                      },
                    }
                  : {
                      pathLength: {
                        duration: 0.72,
                        delay: 0.2 + index * 0.13,
                      },
                      opacity: { duration: 0.2, delay: 0.2 + index * 0.13 },
                    }
              }
            />
            <motion.path
              ref={(node) => {
                corePathRefs.current[index] = node;
              }}
              fill="none"
              stroke="rgba(255,255,255,0.38)"
              strokeWidth="0.9"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isClosing
                  ? { pathLength: 0, opacity: 1 }
                  : { pathLength: 1, opacity: 1 }
              }
              transition={
                isClosing
                  ? {
                      pathLength: {
                        duration: 0.34,
                        delay: (targets.length - 1 - index) * 0.035,
                        ease: [0.64, 0, 0.78, 0],
                      },
                    }
                  : {
                      pathLength: {
                        duration: 0.72,
                        delay: 0.2 + index * 0.13,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.15, delay: 0.2 + index * 0.13 },
                    }
              }
            />
            <circle
              ref={(node) => {
                packetRefs.current[index] = node;
              }}
              fill="white"
              opacity="0"
              filter="url(#contact-packet-glow)"
              className="motion-reduce:hidden"
            />
          </g>
        ))}
        <motion.circle
          ref={originGlowRef}
          fill="white"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, 6, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.65, delay: 0.16, ease: "easeOut" }}
          className="motion-reduce:hidden"
        />
      </g>
    </motion.svg>
  );
};

const ContactModal = ({
  isVisible,
  isClosing,
  onClose,
  onClosed,
  onCopy,
  copiedText,
}: ContactModalProps) => {
  const lanyardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contactTitleRef = useRef<HTMLDivElement>(null);
  const socialButtonsRef = useRef<HTMLDivElement>(null);
  const cardPointRef = useRef<ScreenPoint | null>(null);
  const cardReadyRef = useRef(false);
  const isClosingRef = useRef(isClosing);
  const cardMotionRef = useRef<CardMotionTracker>({
    lastPoint: null,
    lastTimestamp: 0,
    stableSince: 0,
    openedAt: 0,
  });
  const [cableTargets, setCableTargets] = useState<HTMLElement[]>([]);
  const [cardReady, setCardReady] = useState(false);
  const handleCardScreenPosition = useCallback((point: ScreenPoint) => {
    cardPointRef.current = point;
    if (isClosingRef.current) return;

    const now = performance.now();
    const motion = cardMotionRef.current;
    if (motion.openedAt === 0) motion.openedAt = now;

    if (motion.lastPoint && motion.lastTimestamp > 0) {
      const frameDuration = Math.max(1, now - motion.lastTimestamp);
      const movement = Math.hypot(
        point.x - motion.lastPoint.x,
        point.y - motion.lastPoint.y,
      );
      const normalizedMovement = movement * (16.67 / frameDuration);
      const hasFinishedEntrance = now - motion.openedAt >= 780;

      if (normalizedMovement <= 0.7) {
        if (motion.stableSince === 0) motion.stableSince = now;
      } else {
        motion.stableSince = 0;
      }

      const hasSettled =
        hasFinishedEntrance &&
        motion.stableSince > 0 &&
        now - motion.stableSince >= 220;
      const reachedFallback = now - motion.openedAt >= 1900;

      if (!cardReadyRef.current && (hasSettled || reachedFallback)) {
        cardReadyRef.current = true;
        setCardReady(true);
      }
    }

    motion.lastPoint = point;
    motion.lastTimestamp = now;
  }, []);

  useEffect(() => {
    isClosingRef.current = isClosing;
  }, [isClosing]);

  useEffect(() => {
    if (!isVisible) {
      cardReadyRef.current = false;
      setCardReady(false);
      setCableTargets([]);
      return;
    }

    cardPointRef.current = null;
    cardReadyRef.current = false;
    isClosingRef.current = false;
    cardMotionRef.current = {
      lastPoint: null,
      lastTimestamp: 0,
      stableSince: 0,
      openedAt: performance.now(),
    };
    setCardReady(false);
    setCableTargets([]);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !cardReady) {
      setCableTargets([]);
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const targets = socialButtonsRef.current?.querySelectorAll<HTMLElement>(
        "[data-contact-channel]",
      );
      setCableTargets(targets ? Array.from(targets) : []);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [cardReady, isVisible]);

  useEffect(() => {
    if (
      !isVisible ||
      isClosing ||
      !lanyardRef.current ||
      !overlayRef.current ||
      !contactTitleRef.current ||
      !socialButtonsRef.current
    ) {
      return;
    }

    const cardEntranceDistance = -Math.max(120, window.innerHeight * 0.22);
    const openTimeline = gsap.timeline();
    openTimeline
      .set(overlayRef.current, { display: "block", opacity: 0 })
      .to(
        overlayRef.current,
        { opacity: 1, duration: 0.42, ease: "power2.out" },
        0,
      )
      .fromTo(
        contactTitleRef.current,
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.34, ease: "power2.out" },
        0.1,
      )
      .fromTo(
        lanyardRef.current,
        { y: cardEntranceDistance, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.56, ease: "power3.out" },
        0.1,
      )
      .fromTo(
        socialButtonsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        0.42,
      );

    return () => {
      openTimeline.kill();
    };
  }, [isClosing, isVisible]);

  useEffect(() => {
    if (
      !isVisible ||
      !isClosing ||
      !lanyardRef.current ||
      !overlayRef.current ||
      !contactTitleRef.current ||
      !socialButtonsRef.current
    ) {
      return;
    }

    const cardExitDelay = cableTargets.length > 0 ? 0.44 : 0.04;
    const cardExitDistance = -Math.max(120, window.innerHeight * 0.22);
    const closeTimeline = gsap.timeline({ onComplete: onClosed });

    closeTimeline
      .to(
        lanyardRef.current,
        {
          y: cardExitDistance,
          opacity: 0,
          duration: 0.42,
          ease: "power3.in",
        },
        cardExitDelay,
      )
      .to(
        socialButtonsRef.current,
        { y: 16, opacity: 0, duration: 0.26, ease: "power2.in" },
        cardExitDelay,
      )
      .to(
        contactTitleRef.current,
        { y: -14, opacity: 0, duration: 0.3, ease: "power2.in" },
        cardExitDelay + 0.04,
      )
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.36, ease: "power2.inOut" },
        cardExitDelay + 0.08,
      );

    return () => {
      closeTimeline.kill();
    };
  }, [cableTargets.length, isClosing, isVisible, onClosed]);

  if (!isVisible) return null;

  return (
    <>
      {/* Fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black z-20 hidden"
        onClick={isClosing ? undefined : onClose}
      />

      {/* Contact title */}
      <div
        ref={contactTitleRef}
        className="fixed top-24 left-0 w-full z-30 flex justify-center"
      >
        <div
          className="bg-white px-6 py-2 rounded-md shadow-md"
          style={{ transform: "rotate(-2deg)" }}
        >
          <ContactTitleMarquee
            texts={contactTitleTexts}
            velocity={isClosing ? 95 : 25}
            className="font-[PowerGrotesk] text-black tracking-wide"
          />
        </div>
      </div>

      {/* Lanyard */}
      <div
        ref={lanyardRef}
        className="fixed inset-0 z-30 flex items-center justify-center"
      >
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -52, 0]}
          onCardScreenPosition={handleCardScreenPosition}
        />
      </div>

      <AnimatePresence>
        {cableTargets.length > 0 && (
          <ContactCables
            cardPointRef={cardPointRef}
            targets={cableTargets}
            isClosing={isClosing}
          />
        )}
      </AnimatePresence>

      {/* Social Media Buttons */}
      <div
        ref={socialButtonsRef}
        className={`fixed inset-x-0 bottom-4 z-40 px-3 sm:bottom-6 sm:px-5 ${
          isClosing ? "pointer-events-none" : ""
        }`}
      >
        <div className="mx-auto w-fit max-w-full">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-[1.6rem] border border-white/15 bg-black/65 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {contactChannels.map((channel, index) => {
              const Icon = channel.icon;
              const isCopied =
                channel.action === "copy" && copiedText === emailAddress;
              const channelClassName = `group flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-3 transition-[background-color,border-color,color,box-shadow,transform] duration-300 active:scale-95 sm:h-12 sm:px-4 ${
                isCopied
                  ? "border-white bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
                  : "border-transparent text-white/65 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)]"
              }`;
              const channelContent = (
                <>
                  {isCopied ? (
                    <FiCheck className="text-lg sm:text-xl" />
                  ) : (
                    <Icon
                      data-channel-icon
                      className="text-lg transition-transform duration-300 group-hover:scale-105 sm:text-xl"
                    />
                  )}
                  <span className="hidden font-mono text-[8px] uppercase tracking-[0.14em] sm:inline">
                    {isCopied ? "Copied" : channel.name}
                  </span>
                  <span className="hidden font-mono text-[7px] opacity-35 lg:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </>
              );

              return channel.action === "copy" ? (
                <button
                  key={channel.name}
                  type="button"
                  onClick={() => onCopy(emailAddress)}
                  data-contact-channel={channel.name}
                  className={channelClassName}
                  aria-label={isCopied ? "Email copied" : "Copy email address"}
                  aria-live="polite"
                >
                  {channelContent}
                </button>
              ) : (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-channel={channel.name}
                  className={channelClassName}
                  aria-label={channel.name}
                >
                  {channelContent}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            key="copy-notification"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white bg-white px-4 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-black shadow-[0_12px_40px_rgba(255,255,255,0.15)] sm:bottom-28"
          >
            <FiCheck className="text-sm" />
            <span>Email copied</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactModal;
