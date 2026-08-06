import React, { useEffect, useRef, type ReactNode } from 'react';
import Matter from 'matter-js';
import { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, type IBodyDefinition } from 'matter-js';

interface FallingElementsProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  gravity?: number;
  trigger?: 'scroll' | 'mount' | 'hover';
  textColor?: string;
  highlightColor?: string;
  [key: string]: any;
}

interface ExtendedHTMLElement extends HTMLElement {
  _matterClone?: HTMLElement;
  _matterBody?: Body;
}

const FallingElements: React.FC<FallingElementsProps> = ({
  children,
  className = '',
  as: Tag = 'div',
  gravity = 0.2,
  trigger = 'scroll',
  textColor = '#e2e8f0',
  highlightColor = '#3B82F6',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const elementsRef = useRef<ExtendedHTMLElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Matter.js engine
    const engine = Engine.create({
      gravity: { x: 0, y: gravity },
    });
    engineRef.current = engine;

    // Create renderer but don't add it to DOM
    const render = Render.create({
      engine: engine,
      element: containerRef.current,
      options: {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
        wireframes: false,
        background: 'transparent',
       
      },
    });
    renderRef.current = render;

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    World.add(engine.world, mouseConstraint);

    // Get all elements marked for falling
    const elements = Array.from(
      containerRef.current.querySelectorAll<ExtendedHTMLElement>('[data-falling-element]')
    );
    elementsRef.current = elements;

    // Create physics bodies for each element
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      
      // Hide original element
      element.style.visibility = 'hidden';
      
      // Create a clone for physics simulation
      const clone = element.cloneNode(true) as ExtendedHTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.visibility = 'visible';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);

      // Create physics body
      const bodyOptions: IBodyDefinition = {
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
        },
        friction: 0.1,
        restitution: 0.5,
      };

      const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        bodyOptions
      );

      // Store references
      element._matterClone = clone;
      element._matterBody = body;

      World.add(engine.world, body);
    });

    // Start the engine
    Engine.run(engine);
    Render.run(render);

    // Handle animation frame updates
    const update = () => {
      elementsRef.current.forEach((element) => {
        if (element._matterClone && element._matterBody) {
          const body = element._matterBody;
          element._matterClone.style.transform = `translate(${body.position.x - body.bounds.min.x}px, ${
            body.position.y - body.bounds.min.y
          }px) rotate(${body.angle}rad)`;
        }
      });
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
        (renderRef.current as any).textures = {};
      }
      
      if (engineRef.current) {
        Engine.clear(engineRef.current);
      }
      
      elementsRef.current.forEach((element) => {
        if (element._matterClone) {
          element._matterClone.remove();
        }
        element.style.visibility = 'visible';
        delete element._matterClone;
        delete element._matterBody;
      });
    };
  }, [gravity, trigger]);

  return (
    <Tag
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight: '1px' }} // Ensure container has some height
      {...props}
    >
      {children}
    </Tag>
  );
};

export default FallingElements;
