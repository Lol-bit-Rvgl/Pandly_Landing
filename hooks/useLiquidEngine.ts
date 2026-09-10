"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ============================================================
 * Wasm module type — loaded via fetch + instantiateStreaming.
 * Falls back to Canvas2D if Wasm binary is not found.
 * ============================================================ */
interface LiquidWasmModule {
  renderGlass: (
    lens: {
      x: number;
      y: number;
      width: number;
      height: number;
      tokens: {
        distortion: number;
        distortionWidth: number;
        chromaticAberration: number;
        magnification: number;
        borderWidth: number;
        borderSoftness: number;
        lightIntensity: number;
        lightDirectionDeg: number;
        ambientIntensity: number;
        saturation: number;
        refractiveIndex: number;
        lightSpread: number;
        borderSaturation: number;
        borderSolidity: number;
        cornerStyle: number;
        cornerRadius: number;
        depthScale: number;
        refractionMode: number;
        refractionType: number;
        lightMode: number;
        borderMode: number;
      };
      pointer: { x: number; y: number };
      time: number;
      highlightShiftX: number;
      highlightShiftY: number;
    },
    backdrop: Uint8ClampedArray,
    backdropW: number,
    backdropH: number,
    out: Uint8ClampedArray,
    lensW: number,
    lensH: number
  ) => void;
}

const WASM_PATH = "/wasm/liquid_engine.wasm";
const GLUE_PATH = "/wasm/liquid_engine.js";

let wasmModulePromise: Promise<LiquidWasmModule | null> | null = null;

let glueScriptEl: HTMLScriptElement | null = null;

function loadGlueScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (glueScriptEl) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = GLUE_PATH;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load WASM glue script"));
    document.head.appendChild(s);
    glueScriptEl = s;
  });
}

async function loadWasmModule(): Promise<LiquidWasmModule | null> {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (!wasmModulePromise) {
    wasmModulePromise = (async () => {
      try {
        await loadGlueScript();

        const resp = await fetch(WASM_PATH);
        if (!resp.ok) {
          console.warn("[pandly] WASM binary not found, using Canvas2D fallback");
          return null;
        }

        const wasmBinary = await resp.arrayBuffer();
        const factory = (window as unknown as Record<string, unknown>)["LiquidEngine"] as
          | ((opts: {
              wasmBinary: ArrayBuffer;
              onRuntimeInitialized?: () => void;
            }) => Promise<LiquidWasmModule>)
          | undefined;

        if (typeof factory !== "function") {
          console.warn("[pandly] LiquidEngine factory not found, using Canvas2D fallback");
          return null;
        }

        const engine = await factory({
          wasmBinary,
          onRuntimeInitialized() {},
        });

        if (typeof engine.renderGlass !== "function") {
          console.warn("[pandly] renderGlass not found on WASM module");
          return null;
        }

        return engine;
      } catch (err) {
        console.warn("[pandly] WASM load failed, using Canvas2D fallback:", err);
        return null;
      }
    })();
  }
  return wasmModulePromise;
}

/* ============================================================
 * Types mirroring the Wasm bindings and optical parameters
 * ============================================================ */
export interface WasmVec2 {
  x: number;
  y: number;
}

export interface WasmVec3 {
  x: number;
  y: number;
  z: number;
}

export interface WasmGlassTokens {
  distortion: number;
  distortionWidth: number;
  chromaticAberration: number;
  magnification: number;
  borderWidth: number;
  borderSoftness: number;
  lightIntensity: number;
  lightDirectionDeg: number;
  ambientIntensity: number;
  saturation: number;
  refractiveIndex: number;
  lightSpread: number;
  borderSaturation: number;
  borderSolidity: number;
  cornerStyle: number;
  cornerRadius: number;
  depthScale: number;
  refractionMode: number;
  refractionType: number;
  lightMode: number;
  borderMode: number;
}

export interface WasmGlassLens {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tokens: WasmGlassTokens;
  pointer: WasmVec2;
  time: number;
  highlightShiftX: number;
  highlightShiftY: number;
  targetX?: number;
  targetY?: number;
  element?: HTMLElement | null;
}

export interface WasmSpringState {
  position: number;
  velocity: number;
  target: number;
}

export interface WasmSpringParams {
  mass: number;
  stiffness: number;
  damping: number;
}

export interface LiquidTelemetry {
  fps: number;
  frameTimeMs: number;
  normal: [number, number, number]; // N = normal(SDF(p))
  refraction: [number, number];       // R = kr * Nxy * f(edge) * f(interaction)
  fresnel: number;                    // F = F0 + (1-F0)(1 - N.V)^5
  cGlass: string;                     // RGBA hex / CSS
  cFinal: string;                     // RGBA hex / CSS
  pointerVelocity: [number, number];
  activeLensesCount: number;
  refractiveIndex: number;
  chromaticAberration: number;
  distortion: number;
  lightIntensity: number;
}

/* Global telemetry store subscribers */
type TelemetryListener = (telemetry: LiquidTelemetry) => void;
const telemetryListeners = new Set<TelemetryListener>();

let currentTelemetry: LiquidTelemetry = {
  fps: 60,
  frameTimeMs: 16.6,
  normal: [0, 0, 1],
  refraction: [0, 0],
  fresnel: 0.04,
  cGlass: "rgba(230, 83, 60, 0.22)",
  cFinal: "rgba(255, 106, 77, 0.85)",
  pointerVelocity: [0, 0],
  activeLensesCount: 0,
  refractiveIndex: 1.52,
  chromaticAberration: 0.003,
  distortion: 0.08,
  lightIntensity: 0.85,
};

export function subscribeToTelemetry(listener: TelemetryListener) {
  telemetryListeners.add(listener);
  listener(currentTelemetry);
  return () => {
    telemetryListeners.delete(listener);
  };
}

export function getLatestTelemetry() {
  return currentTelemetry;
}

/* ============================================================
 * Canonical Spring Presets from PANDLY_MOTION_PHYSICS_MATRIX
 * ============================================================ */
export const SPRING_PRESETS = {
  // P1 - Press Feedback (mass 1.0, stiffness 500, damping 44.72, ratio 1.00)
  press: { mass: 1.0, stiffness: 500.0, damping: 44.72 },
  // P2 - Travel (mass 1.0, stiffness 320, damping 28.98, ratio 0.81)
  travel: { mass: 1.0, stiffness: 320.0, damping: 28.98 },
  // P3 - Dock Morph (mass 1.25, stiffness 260, damping 33.17, ratio 0.92)
  dockMorph: { mass: 1.25, stiffness: 260.0, damping: 33.17 },
  // P4 - Jelly (mass 1.0, stiffness 260, damping 24.51, ratio 0.76)
  jelly: { mass: 1.0, stiffness: 260.0, damping: 24.51 },
  // Micro-feedback Reaction Pop (mass 0.45, stiffness 420, damping 22)
  reaction: { mass: 0.45, stiffness: 420.0, damping: 22.0 },
  // Inertial sensor ODE (equiv k=676, damping 44.72, ratio 0.86)
  inertialSensor: { mass: 1.0, stiffness: 676.0, damping: 44.72 },
};

/* Analytical spring solver */
export function solveSpring(
  params: WasmSpringParams,
  state: WasmSpringState,
  dt: number
): WasmSpringState {
  const m = Math.max(0.01, params.mass);
  const k = params.stiffness;
  const d = params.damping;
  const x = state.position - state.target;
  const v = state.velocity;

  // Semi-implicit Euler with sub-stepping for stability
  const steps = Math.min(10, Math.max(1, Math.ceil(dt / 0.004)));
  const subDt = dt / steps;

  let curX = x;
  let curV = v;

  for (let i = 0; i < steps; i++) {
    const force = -k * curX - d * curV;
    const accel = force / m;
    curV += accel * subDt;
    curX += curV * subDt;
  }

  // Settle threshold
  if (Math.abs(curX) < 1e-4 && Math.abs(curV) < 1e-3) {
    return { position: state.target, velocity: 0, target: state.target };
  }

  return {
    position: curX + state.target,
    velocity: curV,
    target: state.target,
  };
}

/* Default token generator */
export function createDefaultTokens(preset?: "standardCard" | "interactiveButton" | "adaptiveDock"): WasmGlassTokens {
  const base: WasmGlassTokens = {
    distortion: 0.08,
    distortionWidth: 26.0,
    chromaticAberration: 0.002,
    magnification: 1.0,
    borderWidth: 3.0,
    borderSoftness: 2.0,
    lightIntensity: 0.85,
    lightDirectionDeg: 135.0,
    ambientIntensity: 0.15,
    saturation: 1.0,
    refractiveIndex: 1.5,
    lightSpread: 0.5,
    borderSaturation: 1.0,
    borderSolidity: 0.0,
    cornerStyle: 1.0,
    cornerRadius: 20.0,
    depthScale: 1.0,
    refractionMode: 0,
    refractionType: 1,
    lightMode: 0,
    borderMode: 1,
  };

  if (preset === "interactiveButton") {
    base.distortion = 0.12;
    base.distortionWidth = 18.0;
    base.chromaticAberration = 0.0035;
    base.lightIntensity = 0.95;
    base.cornerRadius = 16.0;
  } else if (preset === "adaptiveDock") {
    base.distortion = 0.06;
    base.distortionWidth = 32.0;
    base.chromaticAberration = 0.0015;
    base.borderWidth = 3.5;
    base.lightIntensity = 0.82;
    base.cornerRadius = 28.0;
    base.cornerStyle = 2.0;
  }

  return base;
}

/* Global registry of lenses so multiple components can register */
const registeredLenses: WasmGlassLens[] = [];

/* ============================================================
 * useLiquidEngine Hook
 * ============================================================ */
export function useLiquidEngine(canvasId: string = "glass-canvas") {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  const inertialPosRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wasmRef = useRef<LiquidWasmModule | null>(null);

  /* Initialize Canvas and context + async WASM load (non-blocking) */
  useEffect(() => {
    let cancelled = false;

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      setReady(true);
      return;
    }

    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    /* Load WASM in background — never blocks LCP or first paint */
    loadWasmModule().then((mod) => {
      if (!cancelled) {
        wasmRef.current = mod;
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [canvasId]);

  /* Global pointer tracking — rAF-throttled for INP < 50ms */
  useEffect(() => {
    let rafPending = false;
    let latestX = 0;
    let latestY = 0;
    let latestTime = performance.now();

    const processPointer = () => {
      rafPending = false;
      const now = performance.now();
      const dt = Math.max(0.001, (now - lastPointerRef.current.time) / 1000);
      const vx = (latestX - lastPointerRef.current.x) / dt;
      const vy = (latestY - lastPointerRef.current.y) / dt;

      pointerRef.current.vx = pointerRef.current.vx * 0.7 + vx * 0.3;
      pointerRef.current.vy = pointerRef.current.vy * 0.7 + vy * 0.3;
      pointerRef.current.x = latestX;
      pointerRef.current.y = latestY;

      lastPointerRef.current = { x: latestX, y: latestY, time: now };
    };

    const onPointerMove = (e: PointerEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      latestTime = performance.now();
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(processPointer);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  /* Physics & Shader Render Loop */
  useEffect(() => {
    if (!ready) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumTime = 0;
    let currentFps = 60;
    let currentFrameTime = 16.6;

    const wn = 26.0; // natural frequency for inertial optics
    const zeta = 0.86; // damping ratio

    const renderLoop = (now: number) => {
      rafRef.current = requestAnimationFrame(renderLoop);

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // FPS tracking
      frameCount++;
      fpsAccumTime += dt;
      if (fpsAccumTime >= 0.25) {
        currentFps = Math.round(frameCount / fpsAccumTime);
        currentFrameTime = +(1000 / Math.max(1, currentFps)).toFixed(1);
        frameCount = 0;
        fpsAccumTime = 0;
      }

      // Update inertial optics ODE
      const targetInertiaX = pointerRef.current.vx * 0.015;
      const targetInertiaY = pointerRef.current.vy * 0.015;
      const c = 2.0 * zeta * wn;
      const k = wn * wn;

      const errX = targetInertiaX - inertialPosRef.current.x;
      const errY = targetInertiaY - inertialPosRef.current.y;
      const accX = errX * k - inertialPosRef.current.vx * c;
      const accY = errY * k - inertialPosRef.current.vy * c;

      inertialPosRef.current.vx += accX * dt;
      inertialPosRef.current.vy += accY * dt;
      inertialPosRef.current.x += inertialPosRef.current.vx * dt;
      inertialPosRef.current.y += inertialPosRef.current.vy * dt;

      // Canvas Rendering
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas ? canvas.width : window.innerWidth * dpr;
      const height = canvas ? canvas.height : window.innerHeight * dpr;

      if (canvas && ctx) {
        ctx.clearRect(0, 0, width, height);

        const wasm = wasmRef.current;

        for (const lens of registeredLenses) {
          if (lens.element) {
            const rect = lens.element.getBoundingClientRect();
            lens.x = rect.left;
            lens.y = rect.top;
            lens.width = rect.width;
            lens.height = rect.height;
          }

          const lx = lens.x * dpr;
          const ly = lens.y * dpr;
          const lw = lens.width * dpr;
          const lh = lens.height * dpr;
          const radius = (lens.tokens.cornerRadius || 20) * dpr;

          if (lw <= 0 || lh <= 0) continue;

          const centerX = lx + lw / 2;
          const centerY = ly + lh / 2;
          const ptrX = pointerRef.current.x * dpr;
          const ptrY = pointerRef.current.y * dpr;
          const dx = (ptrX - centerX) / (lw / 2);
          const dy = (ptrY - centerY) / (lh / 2);
          const distNorm = Math.sqrt(dx * dx + dy * dy);

          const isHovered = distNorm < 1.5;
          const interactionFactor = isHovered ? Math.max(0, 1 - distNorm / 1.5) : 0.05;

          if (wasm) {
            /* ---- Wasm path: use C++ liquid_glass_render for this lens region ---- */
            const sx = Math.max(0, Math.floor(lx));
            const sy = Math.max(0, Math.floor(ly));
            const sw = Math.min(Math.floor(lw), width - sx);
            const sh = Math.min(Math.floor(lh), height - sy);
            if (sw > 0 && sh > 0) {
              const inData = ctx.getImageData(sx, sy, sw, sh);
              const outData = ctx.createImageData(sw, sh);
              const tokens = lens.tokens;
              wasm.renderGlass(
                {
                  x: lens.x,
                  y: lens.y,
                  width: lens.width,
                  height: lens.height,
                  tokens: {
                    distortion: tokens.distortion,
                    distortionWidth: tokens.distortionWidth,
                    chromaticAberration: tokens.chromaticAberration,
                    magnification: tokens.magnification,
                    borderWidth: tokens.borderWidth,
                    borderSoftness: tokens.borderSoftness,
                    lightIntensity: tokens.lightIntensity,
                    lightDirectionDeg: tokens.lightDirectionDeg,
                    ambientIntensity: tokens.ambientIntensity,
                    saturation: tokens.saturation,
                    refractiveIndex: tokens.refractiveIndex,
                    lightSpread: tokens.lightSpread,
                    borderSaturation: tokens.borderSaturation,
                    borderSolidity: tokens.borderSolidity,
                    cornerStyle: tokens.cornerRadius > 24 ? 2.0 : 1.0,
                    cornerRadius: tokens.cornerRadius,
                    depthScale: tokens.depthScale,
                    refractionMode: tokens.refractionMode,
                    refractionType: tokens.refractionType,
                    lightMode: tokens.lightMode,
                    borderMode: tokens.borderMode,
                  },
                  pointer: { x: pointerRef.current.x, y: pointerRef.current.y },
                  time: now / 1000,
                  highlightShiftX: inertialPosRef.current.x * 2,
                  highlightShiftY: inertialPosRef.current.y * 2,
                },
                inData.data,
                width,
                height,
                outData.data,
                sw,
                sh
              );
              ctx.putImageData(outData, sx, sy);
            }
          } else {
            /* ---- Canvas2D fallback path ---- */
            const nx = Math.sin(dx * 1.2) * 0.45;
            const ny = Math.sin(dy * 1.2) * 0.45;
            const nz = Math.sqrt(Math.max(0.1, 1 - (nx * nx + ny * ny)));
            const nDotV = nz;
            const f0 = 0.04;
            const fresnel = f0 + (1 - f0) * Math.pow(1 - nDotV, 5);

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(lx, ly, lw, lh, radius);
            ctx.clip();

            const lightAngle = (lens.tokens.lightDirectionDeg * Math.PI) / 180;
            const gradX0 = centerX + Math.cos(lightAngle) * (lw * 0.6) + inertialPosRef.current.x * dpr * 2;
            const gradY0 = centerY + Math.sin(lightAngle) * (lh * 0.6) + inertialPosRef.current.y * dpr * 2;
            const gradX1 = centerX - Math.cos(lightAngle) * (lw * 0.6);
            const gradY1 = centerY - Math.sin(lightAngle) * (lh * 0.6);

            const grad = ctx.createLinearGradient(gradX0, gradY0, gradX1, gradY1);
            const highlightAlpha = (0.08 + interactionFactor * 0.18 + fresnel * 0.25) * lens.tokens.lightIntensity;
            grad.addColorStop(0, `rgba(255, 255, 255, ${highlightAlpha.toFixed(3)})`);
            grad.addColorStop(0.3, `rgba(255, 106, 77, ${(highlightAlpha * 0.35).toFixed(3)})`);
            grad.addColorStop(0.7, "rgba(230, 83, 60, 0.02)");
            grad.addColorStop(1, "rgba(0, 0, 0, 0.15)");

            ctx.fillStyle = grad;
            ctx.fill();

            ctx.lineWidth = (lens.tokens.borderWidth || 2) * dpr;
            const strokeGrad = ctx.createLinearGradient(lx, ly, lx + lw, ly + lh);
            strokeGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.25 + interactionFactor * 0.4).toFixed(3)})`);
            strokeGrad.addColorStop(0.5, `rgba(230, 83, 60, ${(0.15 + fresnel * 0.5).toFixed(3)})`);
            strokeGrad.addColorStop(1, `rgba(255, 106, 77, ${(0.3 + interactionFactor * 0.5).toFixed(3)})`);
            ctx.strokeStyle = strokeGrad;
            ctx.stroke();

            ctx.restore();
          }
        }
      }

      // Calculate Representative Telemetry for HUD / Inspector
      const activeLens = registeredLenses[0];
      const tokens = activeLens ? activeLens.tokens : createDefaultTokens("standardCard");

      const ptrX = pointerRef.current.x;
      const ptrY = pointerRef.current.y;
      const centerScreenX = window.innerWidth / 2;
      const centerScreenY = window.innerHeight / 2;
      const normPx = (ptrX - centerScreenX) / Math.max(1, centerScreenX);
      const normPy = (ptrY - centerScreenY) / Math.max(1, centerScreenY);

      // Normal from current pointer
      const nx = +(normPx * 0.42).toFixed(3);
      const ny = +(normPy * 0.42).toFixed(3);
      const nz = +Math.sqrt(Math.max(0.1, 1 - (nx * nx + ny * ny))).toFixed(3);

      const f0 = 0.04;
      const fresnelVal = +(f0 + (1 - f0) * Math.pow(Math.max(0, 1 - nz), 5)).toFixed(4);
      const kr = tokens.distortion;
      const rxVal = +(kr * nx * (1 + Math.abs(normPx) * 0.8)).toFixed(4);
      const ryVal = +(kr * ny * (1 + Math.abs(normPy) * 0.8)).toFixed(4);

      // Colors
      const cGlassVal = `rgba(230, 83, 60, ${(0.12 + fresnelVal * 0.35).toFixed(2)})`;
      const cFinalVal = `rgba(255, 106, 77, ${(0.65 + fresnelVal * 0.3).toFixed(2)})`;

      currentTelemetry = {
        fps: currentFps,
        frameTimeMs: currentFrameTime,
        normal: [nx, ny, nz],
        refraction: [rxVal, ryVal],
        fresnel: fresnelVal,
        cGlass: cGlassVal,
        cFinal: cFinalVal,
        pointerVelocity: [+pointerRef.current.vx.toFixed(1), +pointerRef.current.vy.toFixed(1)],
        activeLensesCount: registeredLenses.length,
        refractiveIndex: tokens.refractiveIndex,
        chromaticAberration: tokens.chromaticAberration,
        distortion: tokens.distortion,
        lightIntensity: tokens.lightIntensity,
      };

      // Notify listeners
      telemetryListeners.forEach((fn) => fn(currentTelemetry));
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  /* Public Lens Registration */
  const registerLens = useCallback(
    (config: {
      id?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      element?: HTMLElement | null;
      tokens?: Partial<WasmGlassTokens>;
      preset?: "standardCard" | "interactiveButton" | "adaptiveDock";
    }): WasmGlassLens => {
      const tokens = {
        ...createDefaultTokens(config.preset || "standardCard"),
        ...(config.tokens || {}),
      };

      const lens: WasmGlassLens = {
        id: config.id || `lens-${Math.random().toString(36).substring(2, 9)}`,
        x: config.x || 0,
        y: config.y || 0,
        width: config.width || 200,
        height: config.height || 200,
        element: config.element,
        tokens,
        pointer: { x: 0, y: 0 },
        time: 0,
        highlightShiftX: 0,
        highlightShiftY: 0,
      };

      registeredLenses.push(lens);
      return lens;
    },
    []
  );

  const removeLens = useCallback((lens: WasmGlassLens) => {
    const idx = registeredLenses.indexOf(lens);
    if (idx >= 0) {
      registeredLenses.splice(idx, 1);
    }
  }, []);

  const springStep = useCallback(
    (params: WasmSpringParams, state: WasmSpringState, dt: number) => {
      return solveSpring(params, state, dt);
    },
    []
  );

  return {
    ready,
    error,
    registerLens,
    removeLens,
    springStep,
    presets: SPRING_PRESETS,
    getTelemetry: getLatestTelemetry,
  };
}

/* ============================================================
 * useLiquidTelemetry — React hook for components listening to HUD
 * ============================================================ */
export function useLiquidTelemetry() {
  const [telemetry, setTelemetry] = useState<LiquidTelemetry>(currentTelemetry);

  useEffect(() => {
    return subscribeToTelemetry(setTelemetry);
  }, []);

  return telemetry;
}

/**
 * kineticScrollTo
 * Fluid kinetic scrolling with quartic deceleration curve
 * (cubic-bezier(0.16, 1, 0.3, 1) response) driven by requestAnimationFrame.
 * Eliminates mechanical stops and ensures 120 FPS inertial scroll.
 */
export function kineticScrollTo(target: string | number, offset: number = 70, duration: number = 850) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  let targetY = 0;
  if (typeof target === "string") {
    const cleanId = target.replace(/^#/, "");
    const el = document.getElementById(cleanId);
    if (!el) return;
    const bodyRect = document.body ? document.body.getBoundingClientRect().top : 0;
    const elementRect = el.getBoundingClientRect().top;
    targetY = elementRect - bodyRect - offset;
  } else {
    targetY = target;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 4);

    window.scrollTo(0, startY + distance * eased);

    if (t < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
