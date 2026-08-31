"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { solveSpring, SPRING_PRESETS } from "../hooks/useLiquidEngine";

export interface DockDestination {
  id: string;
  label: string;
  targetId: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  isCreate?: boolean;
}

const DESTINATIONS: DockDestination[] = [
  { id: "home", label: "Inicio", targetId: "home", icon: Home },
  { id: "circles", label: "Círculos", targetId: "circles", icon: Compass },
  { id: "create", label: "Crear", targetId: "create", icon: Plus, isCreate: true },
  { id: "chats", label: "Chats", targetId: "chats", icon: MessageCircle },
  { id: "profile", label: "Perfil", targetId: "profile", icon: User },
];

export function LiquidDock() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);
  const [indicatorScale, setIndicatorScale] = useState(1);
  const [indicatorMorph, setIndicatorMorph] = useState(1);

  // Spring physics states
  // S03 / P3 dockMorph: mass 1.25, stiffness 260, damping 33.17 (ratio 0.92)
  const springPosRef = useRef({ position: 0, velocity: 0, target: 0 });
  const springPosYRef = useRef({ position: 34, velocity: 0, target: 34 });
  const springScaleRef = useRef({ position: 1, velocity: 0, target: 1 });
  const springMorphRef = useRef({ position: 1, velocity: 0, target: 1 });

  const dockRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isScrollingFromClickRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic concentric position calculation from DOM rects
  const calculateTargetCoordinates = useCallback((index: number) => {
    const dockEl = dockRef.current;
    const itemEl = itemRefs.current[index];
    if (!dockEl || !itemEl) return;

    const dockRect = dockEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    // Exact horizontal center relative to dock container
    const centerX = itemRect.left - dockRect.left + itemRect.width / 2;

    // Exact vertical alignment with the icon (centered on the active elevated icon)
    const isCreate = DESTINATIONS[index]?.isCreate;
    const centerY = itemRect.top - dockRect.top + (isCreate ? itemRect.height / 2 : 22);

    springPosRef.current.target = centerX;
    springPosYRef.current.target = centerY;
  }, []);

  const updateTargetIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      calculateTargetCoordinates(index);

      // Trigger elastic scale impulse
      springScaleRef.current.position = 0.86;
      springScaleRef.current.velocity = 2.6;
      springScaleRef.current.target = 1.0;
    },
    [calculateTargetCoordinates]
  );

  // Initial measurement & Resize observer
  useEffect(() => {
    const handleRecalculate = () => {
      calculateTargetCoordinates(activeIndex);
    };

    // Calculate immediately and after brief layout tick
    handleRecalculate();
    const frameId = requestAnimationFrame(handleRecalculate);

    window.addEventListener("resize", handleRecalculate);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleRecalculate);
    };
  }, [activeIndex, calculateTargetCoordinates]);

  // Animation frame loop for continuous spring physics
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // P3 dockMorph (mass: 1.25, stiffness: 260, damping: 33.17 / ratio: 0.92)
      const morphSpring = SPRING_PRESETS.dockMorph;
      const travelSpring = SPRING_PRESETS.travel;
      const pressSpring = SPRING_PRESETS.press;

      // Step X and Y positions
      springPosRef.current = solveSpring(morphSpring, springPosRef.current, dt);
      setIndicatorX(springPosRef.current.position);

      springPosYRef.current = solveSpring(morphSpring, springPosYRef.current, dt);
      setIndicatorY(springPosYRef.current.position);

      // Step Scale and Morph
      springScaleRef.current = solveSpring(travelSpring, springScaleRef.current, dt);
      setIndicatorScale(springScaleRef.current.position);

      springMorphRef.current = solveSpring(pressSpring, springMorphRef.current, dt);
      setIndicatorMorph(springMorphRef.current.position);

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Bidirectional sync with Scroll via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["home", "circles", "create", "chats", "profile"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingFromClickRef.current) return;

        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry && bestEntry.target.id) {
          const index = DESTINATIONS.findIndex((d) => d.targetId === bestEntry!.target.id);
          if (index !== -1 && index !== activeIndex) {
            updateTargetIndex(index);
          }
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -25% 0px",
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeIndex, updateTargetIndex]);

  // Click handler with micro-interaction timing (press: 95ms / release: 145ms / morph: 210ms)
  const handleItemClick = (index: number, targetId: string) => {
    setPressedIndex(index);
    springMorphRef.current.position = 0.82;
    springMorphRef.current.velocity = -2.2;
    springMorphRef.current.target = 1.0;

    // Press timeout: 95ms
    setTimeout(() => {
      setPressedIndex(null);
    }, 95);

    updateTargetIndex(index);

    // Smooth scroll to section
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      isScrollingFromClickRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingFromClickRef.current = false;
      }, 700);
    }
  };

  return (
    <nav
      ref={dockRef}
      aria-label="Liquid Navigation Dock"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 12px",
        height: 68,
        width: "min(94vw, 360px)",
        borderRadius: 36,
        background: "rgba(18, 20, 24, 0.78)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: `
          0 16px 40px -12px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset,
          0 8px 24px -4px rgba(230, 83, 60, 0.25)
        `,
        userSelect: "none",
        touchAction: "manipulation",
      }}
    >
      {/* SVG Liquid Indicator Track & Glow (Directly bounds-aligned) */}
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
          <radialGradient id="liquidBulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6A4D" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#E6533C" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#E6533C" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E6533C" stopOpacity="0" />
          </radialGradient>
          <filter id="liquidBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
          </filter>
        </defs>

        {/* Dynamic Concentric Glowing Indicator Group */}
        {indicatorX > 0 && (
          <g transform={`translate(${indicatorX}, ${indicatorY})`}>
            {/* Concentric Ambient Glow */}
            <circle
              cx="0"
              cy="0"
              r={28 * indicatorScale}
              fill="url(#liquidBulbGlow)"
              filter="url(#liquidBlur)"
            />
            {/* Liquid Cutout Droplet Core */}
            <circle
              cx="0"
              cy="0"
              r={22 * indicatorScale}
              fill="rgba(230, 83, 60, 0.3)"
              stroke="rgba(255, 106, 77, 0.55)"
              strokeWidth="1.2"
            />
            {/* Top Specular Glint */}
            <ellipse
              cx="0"
              cy={-12 * indicatorScale}
              rx={7 * indicatorScale}
              ry={2.2 * indicatorScale}
              fill="rgba(255, 255, 255, 0.65)"
            />
          </g>
        )}
      </svg>

      {/* Dock Destination Items */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 2px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {DESTINATIONS.map((dest, idx) => {
          const Icon = dest.icon;
          const isActive = activeIndex === idx;
          const isPressed = pressedIndex === idx;

          if (dest.isCreate) {
            return (
              <button
                key={dest.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                onClick={() => handleItemClick(idx, dest.targetId)}
                aria-label={dest.label}
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  boxShadow: `
                    0 8px 24px -4px rgba(230, 83, 60, 0.7),
                    0 0 0 2px rgba(255, 255, 255, 0.25) inset
                  `,
                  transform: `
                    translateY(${isActive ? -10 : isPressed ? -2 : -5}px)
                    scale(${isPressed ? 0.92 : isActive ? 1.08 : 1.0})
                  `,
                  transition:
                    "transform 0.21s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.21s ease",
                  outline: "none",
                }}
              >
                <Icon size={24} strokeWidth={2.6} />
              </button>
            );
          }

          return (
            <button
              key={dest.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => handleItemClick(idx, dest.targetId)}
              aria-label={dest.label}
              style={{
                position: "relative",
                width: 52,
                height: 52,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                transform: `
                  translateY(${isActive ? -8 : 0}px)
                  scale(${isPressed ? 0.88 : isActive ? 1.12 : 1.0})
                `,
                transition:
                  "transform 0.145s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.145s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: isActive
                    ? "drop-shadow(0 0 10px rgba(255, 106, 77, 0.85))"
                    : "none",
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </div>

              <span
                style={{
                  fontFamily: "var(--font-dyna-puff), sans-serif",
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  marginTop: 2,
                  opacity: isActive ? 1 : 0.6,
                  color: isActive ? "#FF6A4D" : "rgba(255, 255, 255, 0.5)",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.15s ease, color 0.15s ease",
                }}
              >
                {dest.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
