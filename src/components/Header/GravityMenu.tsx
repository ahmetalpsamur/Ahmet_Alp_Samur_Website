import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";

import gravgunViewmodel from "../../assets/Photo/Half-life/gravgun_vm_close.png";

interface GravityMenuProps {
  /** Subtrees searched for droppable pieces. Must be a stable array. */
  roots: RefObject<HTMLElement | null>[];
  /** Selector for the pieces to drop, resolved inside each root. */
  itemSelector?: string;
  gravity?: number;
  /** Lower is springier — this is the "tractor beam" feel. */
  grabStiffness?: number;
  /** Delay between each piece letting go, in ms. */
  stagger?: number;
  /** Incremented by the HUD to rebuild the scene without remounting it. */
  resetSignal?: number;
  onResettingChange?: (isResetting: boolean) => void;
}

/** Where the claw sits inside the viewmodel image, as a fraction of its box. */
const CLAW = { x: 0.47, y: 0.26 };

const GravityMenu = ({
  roots,
  itemSelector = "[data-gravity]",
  gravity = 1,
  grabStiffness = 0.14,
  stagger = 45,
  resetSignal = 0,
  onResettingChange,
}: GravityMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gunRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGLineElement>(null);
  const arcRef = useRef<SVGPolylineElement>(null);
  const holdRef = useRef<SVGRectElement>(null);
  const reticleRef = useRef<SVGGElement>(null);
  const resetWorldRef = useRef<(() => void) | null>(null);
  const lastResetSignalRef = useRef(resetSignal);
  const onResettingChangeRef = useRef(onResettingChange);

  useEffect(() => {
    onResettingChangeRef.current = onResettingChange;
  }, [onResettingChange]);

  useEffect(() => {
    if (lastResetSignalRef.current === resetSignal) return;
    lastResetSignalRef.current = resetSignal;
    resetWorldRef.current?.();
  }, [resetSignal]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = roots
      .flatMap((root) =>
        root.current
          ? [...root.current.querySelectorAll<HTMLElement>(itemSelector)]
          : []
      )
      // Responsive duplicates are display:none at the current breakpoint.
      .filter((elem) => {
        const rect = elem.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    if (items.length === 0) return;

    const { Engine, Runner, Composite, Bodies, Body, Mouse, MouseConstraint, Query } =
      Matter;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    // Clone every piece into the physics layer, then hide the real one.
    const pieces = items.map((elem) => {
      const rect = elem.getBoundingClientRect();
      const clone = elem.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("a").forEach((a) => a.removeAttribute("href"));
      clone.removeAttribute("id");
      clone.setAttribute("aria-hidden", "true");
      Object.assign(clone.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        visibility: "visible",
        pointerEvents: "none",
        willChange: "transform",
      });
      container.appendChild(clone);

      const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.4,
          friction: 0.35,
          frictionAir: 0.012,
          chamfer: { radius: Math.min(6, rect.width / 2, rect.height / 2) },
        }
      );
      // Must be pinned *after* creation: Body.setStatic only snapshots the real
      // mass while the body is still dynamic, and an `isStatic: true` option
      // leaves nothing to restore — the piece would unfreeze with mass Infinity
      // and never fall.
      Body.setStatic(body, true);

      const previousVisibility = elem.style.visibility;
      elem.style.visibility = "hidden";

      return {
        elem,
        previousVisibility,
        clone,
        body,
        width: rect.width,
        height: rect.height,
        origin: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          angle: 0,
        },
      };
    });
    const sizeById = new Map(
      pieces.map((piece) => [piece.body.id, { w: piece.width, h: piece.height }])
    );

    const timers: number[] = [];
    const clearTimers = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.length = 0;
    };

    // Let go one by one so the menu collapses instead of dropping as a slab.
    const releasePieces = (onReleased?: () => void, initialDelay = 0) => {
      clearTimers();
      pieces.forEach(({ body }, index) => {
        const timer = window.setTimeout(() => {
          Body.setStatic(body, false);
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

          if (index === pieces.length - 1) onReleased?.();
        }, initialDelay + index * stagger);
        timers.push(timer);
      });
    };

    releasePieces();

    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
      Bodies.rectangle(width / 2, height + 30, width * 2, 60, wallOptions),
      Bodies.rectangle(-30, height / 2, 60, height * 3, wallOptions),
      Bodies.rectangle(width + 30, height / 2, 60, height * 3, wallOptions),
      Bodies.rectangle(width / 2, -height, width * 2, 60, wallOptions),
    ];

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: grabStiffness,
        damping: 0.06,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, [
      ...walls,
      mouseConstraint,
      ...pieces.map((piece) => piece.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    type ResetState = {
      startedAt: number;
      duration: number;
      starts: Array<{ x: number; y: number; angle: number }>;
    };

    let resetState: ResetState | null = null;
    let isResetting = false;
    const interactionMask = mouseConstraint.collisionFilter.mask;
    let recoil = 0;

    resetWorldRef.current = () => {
      if (isResetting) return;

      clearTimers();
      isResetting = true;
      onResettingChangeRef.current?.(true);
      mouseConstraint.collisionFilter.mask = 0;
      (mouseConstraint as unknown as { body: Matter.Body | null }).body = null;
      (
        mouseConstraint.constraint as unknown as {
          bodyB: Matter.Body | null;
        }
      ).bodyB = null;
      mouse.button = -1;
      recoil = 1;

      resetState = {
        startedAt: performance.now(),
        duration: 460,
        starts: pieces.map(({ body }) => ({
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        })),
      };

      pieces.forEach(({ body }) => {
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
        Body.setStatic(body, true);
      });
    };

    // Claw position in viewport space, recomputed since the gun sways.
    const clawPoint = () => {
      const gun = gunRef.current;
      if (!gun) return { x: width - 180, y: height - 180 };
      const box = gun.getBoundingClientRect();
      return {
        x: box.left + box.width * CLAW.x,
        y: box.top + box.height * CLAW.y,
      };
    };

    // Right click punts whatever sits under the cursor away from the claw.
    const punt = (event: MouseEvent) => {
      event.preventDefault();
      if (isResetting) return;
      const point = { x: event.clientX, y: event.clientY };
      const [hit] = Query.point(
        pieces.map((piece) => piece.body),
        point
      );
      recoil = 1;
      if (!hit) return;

      const claw = clawPoint();
      const dx = point.x - claw.x;
      const dy = point.y - claw.y;
      const length = Math.hypot(dx, dy) || 1;
      const power = 0.055 * hit.mass;
      Body.applyForce(hit, point, {
        x: (dx / length) * power,
        y: (dy / length) * power,
      });
    };
    container.addEventListener("contextmenu", punt);

    let wasHolding = false;
    let frame = 0;

    const sync = (now = performance.now()) => {
      if (resetState) {
        const progress = Math.min(
          1,
          (now - resetState.startedAt) / resetState.duration,
        );
        const eased = 1 - Math.pow(1 - progress, 3);

        pieces.forEach(({ body, origin }, index) => {
          const start = resetState?.starts[index];
          if (!start) return;

          const angleDelta = Math.atan2(
            Math.sin(origin.angle - start.angle),
            Math.cos(origin.angle - start.angle),
          );
          Body.setPosition(body, {
            x: start.x + (origin.x - start.x) * eased,
            y: start.y + (origin.y - start.y) * eased,
          });
          Body.setAngle(body, start.angle + angleDelta * eased);
        });

        if (progress >= 1) {
          resetState = null;
          pieces.forEach(({ body, origin }) => {
            Body.setPosition(body, { x: origin.x, y: origin.y });
            Body.setAngle(body, origin.angle);
          });
          releasePieces(() => {
            isResetting = false;
            mouseConstraint.collisionFilter.mask = interactionMask;
            onResettingChangeRef.current?.(false);
          }, 140);
        }
      }

      for (const { clone, body, width: w, height: h } of pieces) {
        const { x, y } = body.position;
        clone.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${body.angle}rad)`;
      }

      const held = mouseConstraint.body;
      const holding = !isResetting && Boolean(held);
      if (holding && !wasHolding) recoil = Math.max(recoil, 0.5);
      wasHolding = holding;
      recoil *= 0.87;

      // Viewmodel sway + recoil kick.
      const gun = gunRef.current;
      if (gun) {
        const swayX = (mouse.position.x / width - 0.5) * -26;
        const swayY = (mouse.position.y / height - 0.5) * -16;
        gun.style.transform = `translate(${swayX + recoil * 34}px, ${swayY + recoil * 20}px) rotate(${-recoil * 6}deg)`;
      }
      if (coreRef.current) {
        coreRef.current.style.opacity = String(
          Math.min(1, (holding ? 0.75 : 0.2) + recoil * 0.6)
        );
      }

      const claw = clawPoint();
      const beam = beamRef.current;
      const arc = arcRef.current;
      const hold = holdRef.current;
      if (beam && arc && hold) {
        const opacity = holding ? "1" : "0";
        beam.style.opacity = opacity;
        arc.style.opacity = opacity;
        hold.style.opacity = opacity;

        if (held) {
          beam.setAttribute("x1", String(claw.x));
          beam.setAttribute("y1", String(claw.y));
          beam.setAttribute("x2", String(held.position.x));
          beam.setAttribute("y2", String(held.position.y));

          // Crackling energy arc jittering along the beam.
          const steps = 7;
          const points: string[] = [];
          for (let i = 0; i <= steps; i += 1) {
            const t = i / steps;
            const jitter = i === 0 || i === steps ? 0 : (Math.random() - 0.5) * 22;
            const nx = -(held.position.y - claw.y);
            const ny = held.position.x - claw.x;
            const len = Math.hypot(nx, ny) || 1;
            points.push(
              `${claw.x + (held.position.x - claw.x) * t + (nx / len) * jitter},` +
                `${claw.y + (held.position.y - claw.y) * t + (ny / len) * jitter}`
            );
          }
          arc.setAttribute("points", points.join(" "));

          const size = sizeById.get(held.id);
          if (size) {
            hold.setAttribute("x", String(held.position.x - size.w / 2));
            hold.setAttribute("y", String(held.position.y - size.h / 2));
            hold.setAttribute("width", String(size.w));
            hold.setAttribute("height", String(size.h));
            hold.setAttribute(
              "transform",
              `rotate(${(held.angle * 180) / Math.PI} ${held.position.x} ${held.position.y})`
            );
          }
        }
      }

      if (reticleRef.current) {
        reticleRef.current.setAttribute(
          "transform",
          `translate(${mouse.position.x} ${mouse.position.y}) scale(${holding ? 1.5 : 1})`
        );
      }

      frame = requestAnimationFrame(sync);
    };
    sync();

    return () => {
      cancelAnimationFrame(frame);
      clearTimers();
      resetWorldRef.current = null;
      container.removeEventListener("contextmenu", punt);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      pieces.forEach(({ clone, elem, previousVisibility }) => {
        clone.remove();
        elem.style.visibility = previousVisibility;
      });
    };
  }, [roots, itemSelector, gravity, grabStiffness, stagger]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-30 cursor-none select-none touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <rect
          ref={holdRef}
          fill="none"
          stroke="rgba(255, 186, 92, 0.65)"
          strokeWidth="1"
          strokeDasharray="10 6"
          style={{
            opacity: 0,
            transition: "opacity 120ms linear",
            filter: "drop-shadow(0 0 6px rgba(255, 150, 40, 0.85))",
          }}
        />
        <line
          ref={beamRef}
          stroke="rgba(255, 214, 150, 0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            opacity: 0,
            transition: "opacity 120ms linear",
            filter: "drop-shadow(0 0 10px rgba(255, 140, 30, 1))",
          }}
        />
        <polyline
          ref={arcRef}
          fill="none"
          stroke="rgba(255, 245, 220, 0.75)"
          strokeWidth="1"
          style={{
            opacity: 0,
            filter: "drop-shadow(0 0 6px rgba(255, 190, 80, 1))",
          }}
        />
        <g ref={reticleRef} style={{ transition: "none" }}>
          <circle r="3" fill="rgba(255, 200, 120, 0.9)" />
          <circle
            r="11"
            fill="none"
            stroke="rgba(255, 200, 120, 0.35)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </g>
      </svg>

      {/* Viewmodel: sits bottom-right and sways with the cursor. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 h-56 w-56 sm:-bottom-14 sm:-right-8 sm:h-80 sm:w-80"
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        exit={{ y: 110 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div ref={gunRef} className="relative h-full w-full will-change-transform">
          <img
            src={gravgunViewmodel}
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
          />
          <div
            ref={coreRef}
            className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,168,60,0.85),rgba(255,110,0,0.25)_45%,transparent_70%)] mix-blend-screen blur-md"
            style={{
              left: `${CLAW.x * 100}%`,
              top: `${CLAW.y * 100}%`,
              opacity: 0.2,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GravityMenu;
