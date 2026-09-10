"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight, Film, Flame } from "lucide-react";
import { useLiquidEngine, solveSpring, SPRING_PRESETS, kineticScrollTo } from "../hooks/useLiquidEngine";

/**
 * HeroSpace
 * Interactive hero section combining the 2.5D optical refraction canvas,
 * particle dynamics with pointer inertia, and core product value proposition.
 */
export function HeroSpace() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { registerLens, removeLens } = useLiquidEngine();

  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    baseX: number;
    baseY: number;
    phase: number;
  }>>([]);

  const ripplesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
  }>>([]);

  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, inside: false });
  const lensInertiaRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [ctaScale, setCtaScale] = useState(1);
  const ctaSpringRef = useRef({ position: 1, velocity: 0, target: 1 });

  useEffect(() => {
    if (!containerRef.current) return;
    const lens = registerLens({
      id: "hero-space-lens",
      element: containerRef.current,
      tokens: {
        distortion: 0.12,
        distortionWidth: 32.0,
        chromaticAberration: 0.004,
        lightIntensity: 0.95,
        cornerRadius: 32.0,
        refractiveIndex: 1.55,
      },
    });

    return () => {
      if (lens) removeLens(lens);
    };
  }, [registerLens, removeLens]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = 52;
    const colors = ["#FF6A4D", "#E6533C", "#FFFFFF", "#F08A5B", "#A9B0BC"];
    const pts = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 500;
      pts.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        baseX: x,
        baseY: y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let lastTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      ctaSpringRef.current = solveSpring(SPRING_PRESETS.press, ctaSpringRef.current, dt);
      setCtaScale(ctaSpringRef.current.position);

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);

      // Inertial cursor ODE integration (wn = 26.0, zeta = 0.86)
      const wn = 26.0;
      const zeta = 0.86;
      const c = 2.0 * zeta * wn;
      const k = wn * wn;

      const targetX = pointerRef.current.inside ? pointerRef.current.x * dpr : w / 2;
      const targetY = pointerRef.current.inside ? pointerRef.current.y * dpr : h / 2;

      const errX = targetX - lensInertiaRef.current.x;
      const errY = targetY - lensInertiaRef.current.y;
      const accX = errX * k - lensInertiaRef.current.vx * c;
      const accY = errY * k - lensInertiaRef.current.vy * c;

      lensInertiaRef.current.vx += accX * dt;
      lensInertiaRef.current.vy += accY * dt;
      lensInertiaRef.current.x += lensInertiaRef.current.vx * dt;
      lensInertiaRef.current.y += lensInertiaRef.current.vy * dt;

      const inX = lensInertiaRef.current.x;
      const inY = lensInertiaRef.current.y;

      // Ambient optical grid
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 40 * dpr;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // Liquid ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.radius += 120 * dt * dpr;
        rip.alpha -= 0.65 * dt;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 106, 77, ${rip.alpha.toFixed(3)})`;
        ctx.lineWidth = 2 * dpr;
        ctx.shadowColor = "#FF6A4D";
        ctx.shadowBlur = 12 * dpr;
        ctx.stroke();
        ctx.restore();
      }

      // Particle simulation with vector displacement
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.phase += dt * 1.5;
        p.x += p.vx * 60 * dt * dpr;
        p.y += p.vy * 60 * dt * dpr;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dx = p.x - inX;
        const dy = p.y - inY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let dispX = 0;
        let dispY = 0;
        if (dist < 180 * dpr && dist > 0) {
          const force = (1 - dist / (180 * dpr)) * 24 * dpr;
          dispX = (dx / dist) * force;
          dispY = (dy / dist) * force;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x + dispX, p.y + dispY, p.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.8 + 0.2 * Math.sin(p.phase));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * dpr;
        ctx.fill();
        ctx.restore();

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 75 * dpr) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x + dispX, p.y + dispY);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 106, 77, ${(0.15 * (1 - cdist / (75 * dpr))).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Specular focal glow
      ctx.save();
      const spotGrad = ctx.createRadialGradient(inX, inY, 0, inX, inY, 220 * dpr);
      spotGrad.addColorStop(0, "rgba(255, 106, 77, 0.22)");
      spotGrad.addColorStop(0.4, "rgba(230, 83, 60, 0.08)");
      spotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(inX, inY, 220 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.inside = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.inside = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;

    ripplesRef.current.push({
      x,
      y,
      radius: 10 * dpr,
      maxRadius: 240 * dpr,
      alpha: 0.9,
    });
  };

  const handleCtaClick = () => {
    ctaSpringRef.current.position = 0.88;
    ctaSpringRef.current.velocity = -3.2;
    ctaSpringRef.current.target = 1.0;

    kineticScrollTo("features", 70);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 90px 24px",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {/* 2.5D Optical Refraction & Inertial Canvas Backing */}
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCanvasClick}
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(96vw, 1100px)",
          height: "min(70vh, 620px)",
          borderRadius: 36,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "radial-gradient(ellipse at center, rgba(30, 33, 39, 0.45) 0%, rgba(0,0,0,0.85) 100%)",
          boxShadow: `
            0 32px 80px -20px rgba(0,0,0,0.9),
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 0 60px -10px rgba(230, 83, 60, 0.15)
          `,
          cursor: "crosshair",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>

      {/* Orbital Lateral Floats Keyframes & Responsive Rules */}
      <style>{`
        @keyframes pandlyOrbitalLeft {
          0%, 100% {
            transform: translateY(-50%) rotate(0deg);
          }
          50% {
            transform: translateY(calc(-50% - 14px)) rotate(-1.5deg);
          }
        }
        @keyframes pandlyOrbitalRight {
          0%, 100% {
            transform: translateY(-50%) rotate(0deg);
          }
          50% {
            transform: translateY(calc(-50% + 14px)) rotate(1.5deg);
          }
        }
        @media (max-width: 1100px) {
          .pandly-orbital-widget {
            display: none !important;
          }
        }
      `}</style>

      {/* Left Orbital Capsule: Avatar 2.5D Reactivo */}
      <aside
        className="pandly-orbital-widget pandly-orbital-left"
        aria-label="Avatar 2.5D y Audio Espacial"
        style={{
          position: "absolute",
          left: "clamp(20px, 4vw, 64px)",
          top: "46%",
          transform: "translateY(-50%)",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          borderRadius: 24,
          background: "rgba(18, 20, 24, 0.78)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 106, 77, 0.35)",
          boxShadow: "0 18px 44px -8px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(230, 83, 60, 0.25)",
          animation: "pandlyOrbitalLeft 6.5s ease-in-out infinite",
          pointerEvents: "auto",
          cursor: "default",
          userSelect: "none",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.65)";
          e.currentTarget.style.boxShadow =
            "0 22px 52px -6px rgba(0, 0, 0, 0.9), 0 0 32px -2px rgba(230, 83, 60, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.35)";
          e.currentTarget.style.boxShadow =
            "0 18px 44px -8px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(230, 83, 60, 0.25)";
        }}
      >
        <img
          src="/assets/images/Panda_Head.png"
          alt="Panda Avatar"
          style={{
            width: 44,
            height: 44,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 14px rgba(230, 83, 60, 0.55))",
          }}
        />
        <div>
          <div style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 13, color: "#FFF", fontWeight: 600 }}>
            Avatar 2.5D Reactivo
          </div>
          <div style={{ fontFamily: "var(--font-lilita-one)", fontSize: 11, color: "#FF6A4D" }}>
            Audio Espacial • 523 Living Stickers
          </div>
        </div>
      </aside>

      {/* Right Orbital Capsule: Presencia en Vivo */}
      <aside
        className="pandly-orbital-widget pandly-orbital-right"
        aria-label="Usuarios Activos en Vivo"
        style={{
          position: "absolute",
          right: "clamp(20px, 4vw, 64px)",
          top: "40%",
          transform: "translateY(-50%)",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 999,
          background: "rgba(18, 20, 24, 0.78)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 18px 44px -8px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(6, 214, 160, 0.2)",
          animation: "pandlyOrbitalRight 7.5s ease-in-out infinite 0.9s",
          pointerEvents: "auto",
          cursor: "default",
          userSelect: "none",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(6, 214, 160, 0.5)";
          e.currentTarget.style.boxShadow =
            "0 22px 52px -6px rgba(0, 0, 0, 0.9), 0 0 32px -2px rgba(6, 214, 160, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
          e.currentTarget.style.boxShadow =
            "0 18px 44px -8px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(6, 214, 160, 0.2)";
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            backgroundColor: "#06D6A0",
            boxShadow: "0 0 12px #06D6A0",
            display: "inline-block",
            animation: "pulse 2s infinite ease-in-out",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 12,
            color: "#FFFFFF",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          2,480 en Watch Parties & Rol en Vivo
        </span>
      </aside>

      {/* Central Hero Stage (Unobstructed, Air & Clarity) */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          textAlign: "center",
          maxWidth: 860,
          marginTop: "auto",
          marginBottom: "auto",
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Superior Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 22px",
            borderRadius: 999,
            background: "rgba(230, 83, 60, 0.14)",
            border: "1px solid rgba(255, 106, 77, 0.38)",
            color: "#FF6A4D",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
            boxShadow: "0 0 28px rgba(230, 83, 60, 0.22)",
          }}
        >
          <Flame size={16} />
          <span>La nueva dimensión de interacción social</span>
        </div>

        {/* Display Headline */}
        <h1
          style={{
            fontFamily: "var(--font-dyna-puff), cursive",
            fontSize: "clamp(2.4rem, 6.4vw, 4.8rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: "0 0 22px 0",
            color: "#FFFFFF",
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.85)",
            textShadow: `
              0 0 35px rgba(230, 83, 60, 0.55),
              0 0 70px rgba(255, 106, 77, 0.3),
              0 4px 14px rgba(0, 0, 0, 0.9)
            `,
            letterSpacing: "-0.02em",
          }}
        >
          Tu espacio para rolear, conectar <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FF6A4D 50%, #E6533C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            y vivir la pantalla juntos.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-lilita-one), sans-serif",
            fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
            lineHeight: 1.6,
            color: "#A9B0BC",
            maxWidth: 680,
            margin: "0 auto 40px auto",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Salas de cine sincronizadas, chats de voz interactivos y círculos donde tu identidad cobra vida.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleCtaClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 36px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
              color: "#FFFFFF",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: `
                0 12px 36px -6px rgba(230, 83, 60, 0.65),
                0 0 0 1px rgba(255, 255, 255, 0.3) inset
              `,
              transform: `scale(${ctaScale})`,
              transition: "box-shadow 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 16px 44px -4px rgba(255, 106, 77, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.4) inset";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 36px -6px rgba(230, 83, 60, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.3) inset";
            }}
          >
            <Sparkles size={20} />
            <span>Unirse a la Beta • Explorar Pandly</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => {
              kineticScrollTo("chats", 70);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 28px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            <Film size={18} color="#FF6A4D" />
            <span>Ver Salas en Vivo</span>
          </button>
        </div>
      </div>
    </section>
  );
}
