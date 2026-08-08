import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  Geometry,
  Mesh,
  Program,
  Renderer,
  RenderTarget,
  Texture,
  Triangle,
} from "ogl";

const MAX_WAVES = 100;
const START_SCALE = 1.5;
const LIFE_CONSTANT = Math.log(500);
const QUALITY_SCALE = { low: 0.4, medium: 0.7, high: 1 } as const;

const waveVertex = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;

varying vec2 vUv;
varying float vOpacity;

void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`;

const waveFragment = `
precision highp float;

varying vec2 vUv;
varying float vOpacity;

uniform float uRings;

const float PI = 3.141592653589793;
const float EDGE = 0.006737947;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;

  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);

  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`;

const screenVertex = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const compositeFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uDispersion;
uniform float uGlint;
uniform float uTintAmount;
uniform float uGrayscale;

const float TAU = 6.283185307179586;

vec2 containBottomUV(vec2 uv) {
  vec2 safeTextureSize = max(uTextureSize, vec2(1.0));
  float imageAspect = safeTextureSize.x / safeTextureSize.y;
  float viewportAspect = uResolution.x / uResolution.y;
  vec2 renderedSize;

  if (imageAspect > viewportAspect) {
    renderedSize = vec2(uResolution.x, uResolution.x / imageAspect);
  } else {
    renderedSize = vec2(uResolution.y * imageAspect, uResolution.y);
  }

  vec2 offset = vec2((uResolution.x - renderedSize.x) * 0.5, 0.0);
  return (uv * uResolution - offset) / renderedSize;
}

vec4 sampleImage(vec2 uv) {
  float inside =
    step(0.0, uv.x) * step(uv.x, 1.0) *
    step(0.0, uv.y) * step(uv.y, 1.0);
  return texture2D(uTexture, clamp(uv, 0.0, 1.0)) * inside;
}

void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = containBottomUV(vUv);

  float theta = amount * uSwirl * TAU;
  vec2 direction = vec2(sin(theta), cos(theta));
  vec2 push = direction * amount * uStrength;
  vec4 centerSample = sampleImage(base + push);
  vec3 color = centerSample.rgb;

  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = sampleImage(base + push * (1.0 + split)).r;
    color.g = centerSample.g;
    color.b = sampleImage(base + push * (1.0 - split)).b;
  }

  if (uGrayscale > 0.001) {
    color = mix(
      color,
      vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))),
      uGrayscale
    );
  }

  if (uTintAmount > 0.001) {
    color = mix(
      color,
      color * uTint * 1.9,
      clamp(amount * 1.6, 0.0, 1.0) * uTintAmount
    );
  }

  if (uGlint > 0.001) {
    float ex =
      texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r -
      texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
    float ey =
      texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r -
      texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
    vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
    vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
    float raw = pow(max(dot(normal, light), 0.0), 22.0);
    float flatSpec = pow(max(light.z, 0.0), 22.0);
    color += uHighlight *
      clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) *
      uGlint * centerSample.a;
  }

  gl_FragColor = vec4(color, centerSample.a);
}
`;

type RippleQuality = keyof typeof QUALITY_SCALE;

export interface RippleDistortionProps {
  src: string;
  alt: string;
  brushSize?: number;
  strength?: number;
  swirl?: number;
  rings?: number;
  spread?: number;
  fade?: number;
  dispersion?: number;
  glint?: number;
  tint?: string;
  tintAmount?: number;
  grayscale?: boolean;
  highlightColor?: string;
  clickStrength?: number;
  quality?: RippleQuality;
  enabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface WaveConfig {
  brushSize: number;
  spread: number;
  fade: number;
  clickStrength: number;
  enabled: boolean;
}

interface Wave {
  x: number;
  y: number;
  scale: number;
  target: number;
  size: number;
  opacity: number;
}

interface CompositeUniforms {
  uTexture: { value: Texture };
  uDisplacement: { value: Texture };
  uResolution: { value: [number, number] };
  uTextureSize: { value: [number, number] };
  uTexel: { value: [number, number] };
  uTint: { value: [number, number, number] };
  uHighlight: { value: [number, number, number] };
  uStrength: { value: number };
  uSwirl: { value: number };
  uDispersion: { value: number };
  uGlint: { value: number };
  uTintAmount: { value: number };
  uGrayscale: { value: number };
}

interface WaveUniforms {
  uRings: { value: number };
}

interface RippleUniforms {
  wave: WaveUniforms;
  composite: CompositeUniforms;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((character) => character + character)
          .join("")
      : clean;
  const value = Number.parseInt(full, 16);

  if (Number.isNaN(value)) return [1, 1, 1];

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
};

const RippleDistortion = ({
  src,
  alt,
  brushSize = 150,
  strength = 0.2,
  swirl = 1,
  rings = 4,
  spread = 5,
  fade = 3,
  dispersion = 0,
  glint = 0,
  tint = "#a855f7",
  tintAmount = 0.1,
  grayscale = true,
  highlightColor = "#ffffff",
  clickStrength = 2,
  quality = "low",
  enabled = true,
  className = "",
  style,
}: RippleDistortionProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<WaveConfig>({
    brushSize,
    spread,
    fade,
    clickStrength,
    enabled,
  });
  const uniformsRef = useRef<RippleUniforms | null>(null);
  const appearanceRef = useRef({
    dispersion,
    glint,
    grayscale,
    highlightColor,
    rings,
    strength,
    swirl,
    tint,
    tintAmount,
  });

  configRef.current = { brushSize, spread, fade, clickStrength, enabled };
  appearanceRef.current = {
    dispersion,
    glint,
    grayscale,
    highlightColor,
    rings,
    strength,
    swirl,
    tint,
    tintAmount,
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const appearance = appearanceRef.current;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;

    gl.clearColor(0, 0, 0, 0);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const imageTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });
    const offsets = new Float32Array(MAX_WAVES * 2);
    const scales = new Float32Array(MAX_WAVES * 2);
    const opacities = new Float32Array(MAX_WAVES);
    const waves: Wave[] = Array.from({ length: MAX_WAVES }, () => ({
      x: 0,
      y: 0,
      scale: START_SCALE,
      target: START_SCALE,
      size: 1,
      opacity: 0,
    }));
    let currentWave = 0;

    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([
          -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
        ]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      },
      iOffset: { instanced: 1, size: 2, data: offsets },
      iScale: { instanced: 1, size: 2, data: scales },
      iOpacity: { instanced: 1, size: 1, data: opacities },
    });
    const waveUniforms: WaveUniforms = {
      uRings: { value: appearance.rings },
    };
    const waveProgram = new Program(gl, {
      vertex: waveVertex,
      fragment: waveFragment,
      uniforms: waveUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
    });

    waveProgram.setBlendFunc(gl.ONE, gl.ONE);

    const waveMesh = new Mesh(gl, {
      geometry,
      program: waveProgram,
      frustumCulled: false,
    });
    const displacementTarget = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });
    const compositeUniforms: CompositeUniforms = {
      uTexture: { value: imageTexture },
      uDisplacement: { value: displacementTarget.texture },
      uResolution: { value: [1, 1] },
      uTextureSize: { value: [1, 1] },
      uTexel: { value: [1, 1] },
      uTint: { value: hexToRgb(appearance.tint) },
      uHighlight: { value: hexToRgb(appearance.highlightColor) },
      uStrength: { value: appearance.strength },
      uSwirl: { value: appearance.swirl },
      uDispersion: { value: appearance.dispersion },
      uGlint: { value: appearance.glint },
      uTintAmount: { value: appearance.tintAmount },
      uGrayscale: { value: appearance.grayscale ? 1 : 0 },
    };
    const compositeMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: compositeFragment,
        uniforms: compositeUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    });

    uniformsRef.current = { wave: waveUniforms, composite: compositeUniforms };

    let disposed = false;
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      imageTexture.image = image;
      compositeUniforms.uTextureSize.value = [
        image.naturalWidth || 1,
        image.naturalHeight || 1,
      ];
    };
    image.src = src;

    let width = 1;
    let height = 1;
    const resize = () => {
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height);
      compositeUniforms.uResolution.value = [width, height];

      const scale = QUALITY_SCALE[quality];
      const fieldWidth = Math.max(2, Math.round(width * scale));
      const fieldHeight = Math.max(2, Math.round(height * scale));
      displacementTarget.setSize(fieldWidth, fieldHeight);
      compositeUniforms.uTexel.value = [1 / fieldWidth, 1 / fieldHeight];
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const addWave = (x: number, y: number, power: number) => {
      const config = configRef.current;
      const wave = waves[currentWave];
      if (!wave) return;

      currentWave = (currentWave + 1) % MAX_WAVES;
      wave.x = x;
      wave.y = y;
      wave.scale = START_SCALE * power;
      wave.target = START_SCALE * Math.max(1, config.spread) * power;
      wave.size = Math.max(1, config.brushSize);
      wave.opacity = 1;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const config = configRef.current;
      if (!config.enabled || reduceMotion) return;

      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      addWave(
        event.clientX - rect.left,
        rect.height - (event.clientY - rect.top),
        Math.max(1, config.clickStrength),
      );
    };
    mount.addEventListener("pointerdown", handlePointerDown, { passive: true });

    let animationFrame = 0;
    let previousTime = 0;
    const render = (now: number) => {
      animationFrame = requestAnimationFrame(render);
      const delta = previousTime
        ? Math.min(0.05, (now - previousTime) / 1000)
        : 0;
      previousTime = now;

      const config = configRef.current;
      const growth = reduceMotion ? 0 : 1 - Math.exp(-delta * 1.09);
      const decay = reduceMotion
        ? 1
        : Math.exp(
            (-delta * LIFE_CONSTANT) / Math.max(0.15, config.fade),
          );

      for (let index = 0; index < MAX_WAVES; index += 1) {
        const wave = waves[index];
        if (!wave || wave.opacity <= 0) {
          opacities[index] = 0;
          continue;
        }

        wave.opacity *= decay;
        wave.scale += (wave.target - wave.scale) * growth;

        if (wave.opacity < 0.002) {
          wave.opacity = 0;
          opacities[index] = 0;
          continue;
        }

        const half = (wave.scale * wave.size) / 2;
        offsets[index * 2] = (wave.x / width) * 2 - 1;
        offsets[index * 2 + 1] = (wave.y / height) * 2 - 1;
        scales[index * 2] = (half / width) * 2;
        scales[index * 2 + 1] = (half / height) * 2;
        opacities[index] = wave.opacity;
      }

      geometry.attributes.iOffset.needsUpdate = true;
      geometry.attributes.iScale.needsUpdate = true;
      geometry.attributes.iOpacity.needsUpdate = true;

      renderer.render({ scene: waveMesh, target: displacementTarget, clear: true });
      renderer.render({ scene: compositeMesh, clear: true });
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", handlePointerDown);
      uniformsRef.current = null;

      if (canvas.parentNode === mount) mount.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [quality, src]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.wave.uRings.value = rings;
    uniforms.composite.uStrength.value = strength;
    uniforms.composite.uSwirl.value = swirl;
    uniforms.composite.uDispersion.value = dispersion;
    uniforms.composite.uGlint.value = glint;
    uniforms.composite.uTintAmount.value = tintAmount;
    uniforms.composite.uGrayscale.value = grayscale ? 1 : 0;
    uniforms.composite.uHighlight.value = hexToRgb(highlightColor);
    uniforms.composite.uTint.value = hexToRgb(tint);
  }, [
    dispersion,
    glint,
    grayscale,
    highlightColor,
    rings,
    strength,
    swirl,
    tint,
    tintAmount,
  ]);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label={alt}
      className={`overflow-hidden ${className}`.trim()}
      style={style}
    />
  );
};

export default RippleDistortion;
