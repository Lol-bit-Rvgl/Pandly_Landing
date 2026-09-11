"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Home, Gamepad2, Compass, Film, Headphones, User } from "lucide-react";
import { solveSpring, SPRING_PRESETS, kineticScrollTo } from "../hooks/useLiquidEngine";

export interface NavDestination {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const DESTINATIONS: NavDestination[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "features", label: "Espacios", icon: Gamepad2 },
  { id: "circles", label: "Círculos", icon: Compass },
  { id: "feed", label: "Formatos", icon: Film },
  { id: "chats", label: "Salas", icon: Headphones },
  { id: "profile", label: "Perfil", icon: User },
];

/**
 * TopProgressHeader
 * Unified top navigation header inspired by Bones Social and Kyodo.
 * Features:
 *  - Interactive glass nav menu with liquid concentric ember glow indicator
 *  - 120 FPS spring physics (mass: 1.25, stiffness: 260, damping: 33.17)
 *  - Assisted kinetic scrolling (quartic curve) to eliminate abrupt stops
 *  - Zero-reflow GPU scaleX scroll progress track
 */
export function TopProgressHeader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorScale, setIndicatorScale] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState<number>(147);

  useEffect(() => {
    let active = true;
    fetch("/api/discord")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.onlineMembers === "number") {
          setOnlineMembers(data.onlineMembers);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const springPosRef = useRef({ position: 0, velocity: 0, target: 0 });
  const springScaleRef = useRef({ position: 1, velocity: 0, target: 1 });

  const navTrackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic concentric position calculation
  const calculateTargetCoordinates = useCallback((index: number) => {
    const trackEl = navTrackRef.current;
    const itemEl = itemRefs.current[index];
    if (!trackEl || !itemEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const centerX = itemRect.left - trackRect.left + itemRect.width / 2;

    springPosRef.current.target = centerX;
  }, []);

  const updateTargetIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      calculateTargetCoordinates(index);

      // Elastic pulse impulse
      springScaleRef.current.position = 0.85;
      springScaleRef.current.velocity = 2.4;
      springScaleRef.current.target = 1.0;
    },
    [calculateTargetCoordinates]
  );

  // Initial calculation & resize listener
  useEffect(() => {
    const handleRecalculate = () => {
      calculateTargetCoordinates(activeIndex);
    };

    handleRecalculate();
    const frameId = requestAnimationFrame(handleRecalculate);
    window.addEventListener("resize", handleRecalculate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleRecalculate);
    };
  }, [activeIndex, calculateTargetCoordinates]);

  // Spring physics loop
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // P3 dockMorph spring
      springPosRef.current = solveSpring(SPRING_PRESETS.dockMorph, springPosRef.current, dt);
      setIndicatorX(springPosRef.current.position);

      springScaleRef.current = solveSpring(SPRING_PRESETS.travel, springScaleRef.current, dt);
      setIndicatorScale(springScaleRef.current.position);

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Zero-reflow scroll progress & bidirectional section detector
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }

          setIsScrolled(scrollY > 30);

          if (!isClickScrollingRef.current) {
            const scrollMiddle = scrollY + window.innerHeight * 0.35;
            for (let i = DESTINATIONS.length - 1; i >= 0; i--) {
              const el = document.getElementById(DESTINATIONS[i].id);
              if (el && el.offsetTop <= scrollMiddle) {
                if (i !== activeIndex) {
                  updateTargetIndex(i);
                }
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex, updateTargetIndex]);

  const handleNavClick = (index: number, id: string) => {
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    updateTargetIndex(index);
    kineticScrollTo(id, 65, 800);

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 95,
        pointerEvents: "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          width: "min(96vw, 1200px)",
          margin: "12px auto 0 auto",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 999,
          background: isScrolled ? "rgba(10, 11, 14, 0.85)" : "rgba(10, 11, 14, 0.55)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isScrolled
            ? "0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04) inset"
            : "0 8px 24px -6px rgba(0, 0, 0, 0.4)",
          pointerEvents: "auto",
          transition: "all 0.3s ease",
        }}
      >
        {/* Brand mark */}
        <button
          onClick={() => handleNavClick(0, "home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            outline: "none",
          }}
        >
          <img
            src="/assets/images/Panda_Head.png"
            alt="Pandly Logo"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 15,
              fontWeight: 700,
              color: "#FFF",
              letterSpacing: "-0.01em",
            }}
          >
            Pandly
          </span>
          <span
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 11,
              color: "rgba(255, 255, 255, 0.45)",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            2.5D
          </span>
        </button>

        {/* Central Unified Interactive Nav Menu with Liquid Glow */}
        <div
          ref={navTrackRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 8px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Liquid Concentric Indicator SVG */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <defs>
              <radialGradient id="topNavBulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF6A4D" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#E6533C" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E6533C" stopOpacity="0" />
              </radialGradient>
              <filter id="topNavBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>
            </defs>

            {indicatorX > 0 && (
              <g transform={`translate(${indicatorX}, 18)`}>
                <circle
                  cx="0"
                  cy="0"
                  r={22 * indicatorScale}
                  fill="url(#topNavBulbGlow)"
                  filter="url(#topNavBlur)"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={16 * indicatorScale}
                  fill="rgba(230, 83, 60, 0.25)"
                  stroke="rgba(255, 106, 77, 0.45)"
                  strokeWidth="1"
                />
              </g>
            )}
          </svg>

          {DESTINATIONS.map((dest, idx) => {
            const isActive = activeIndex === idx;
            const Icon = dest.icon;

            return (
              <button
                key={dest.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                onClick={() => handleNavClick(idx, dest.id)}
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: isActive ? "rgba(255, 106, 77, 0.15)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={14} strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{dest.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right action: Live presence pulse */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontFamily: "var(--font-dyna-puff)",
            color: "#A9B0BC",
            userSelect: "none",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#06D6A0",
              boxShadow: "0 0 8px #06D6A0",
            }}
          />
          <span style={{ display: "inline-block" }}>{onlineMembers.toLocaleString()} en vivo</span>
        </div>
      </div>

      {/* GPU ScaleX zero-reflow progress track */}
      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: 0,
          width: "100%",
          height: "2px",
          background: "rgba(255, 255, 255, 0.04)",
          overflow: "hidden",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #E6533C 0%, #FF6A4D 85%, #FFFFFF 100%)",
            boxShadow: "0 0 12px #FF6A4D",
            transformOrigin: "0% 50%",
            transform: "scaleX(0)",
            willChange: "transform",
          }}
        />
      </div>
    </header>
  );
}
