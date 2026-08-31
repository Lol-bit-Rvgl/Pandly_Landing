"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { solveSpring, SPRING_PRESETS } from "../hooks/useLiquidEngine";
import { Sparkles, Heart, Flame, Laugh, PartyPopper } from "lucide-react";

export interface ReactionItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const DEFAULT_REACTIONS: ReactionItem[] = [
  { id: "heart", name: "Corazón", emoji: "❤️", color: "#FF4D6D", icon: Heart },
  { id: "fire", name: "Fuego", emoji: "🔥", color: "#FF6A4D", icon: Flame },
  { id: "party", name: "Fiesta", emoji: "🎉", color: "#F08A5B", icon: PartyPopper },
  { id: "laugh", name: "Risa", emoji: "😂", color: "#FFD166", icon: Laugh },
  { id: "sparkle", name: "Magia", emoji: "✨", color: "#06D6A0", icon: Sparkles },
];

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  alpha: number;
  emoji: string;
  rotation: number;
}

/**
 * ReactionPicker
 * 5-column floating reaction bar with spring dynamics (m=0.45, k=420, d=22)
 * and particle emission on press.
 */
export function ReactionPicker() {
  const [counts, setCounts] = useState<Record<string, number>>({
    heart: 184,
    fire: 312,
    party: 95,
    laugh: 142,
    sparkle: 260,
  });

  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const [scales, setScales] = useState<Record<string, number>>({
    heart: 1,
    fire: 1,
    party: 1,
    laugh: 1,
    sparkle: 1,
  });

  const springStatesRef = useRef<Record<string, { position: number; velocity: number; target: number }>>({
    heart: { position: 1, velocity: 0, target: 1 },
    fire: { position: 1, velocity: 0, target: 1 },
    party: { position: 1, velocity: 0, target: 1 },
    laugh: { position: 1, velocity: 0, target: 1 },
    sparkle: { position: 1, velocity: 0, target: 1 },
  });

  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const update = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const reactionParams = SPRING_PRESETS.reaction;
      const nextScales: Record<string, number> = {};

      Object.keys(springStatesRef.current).forEach((key) => {
        springStatesRef.current[key] = solveSpring(reactionParams, springStatesRef.current[key], dt);
        nextScales[key] = springStatesRef.current[key].position;
      });

      setScales(nextScales);

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt * 60,
            y: p.y + p.vy * dt * 60,
            vy: p.vy + 0.15,
            alpha: p.alpha - dt * 1.1,
            scale: p.scale * 0.98,
            rotation: p.rotation + 2,
          }))
          .filter((p) => p.alpha > 0.05)
      );

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleReactionPress = useCallback((reaction: ReactionItem, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveReactionId(reaction.id);

    springStatesRef.current[reaction.id] = {
      position: 1.45,
      velocity: 6.5,
      target: 1.0,
    };

    setCounts((prev) => ({
      ...prev,
      [reaction.id]: prev[reaction.id] + 1,
    }));

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || rect;
    const spawnX = rect.left - containerRect.left + rect.width / 2;
    const spawnY = rect.top - containerRect.top;

    const newParticles: FloatingParticle[] = [];
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: Math.random() + Date.now(),
        x: spawnX + (Math.random() - 0.5) * 20,
        y: spawnY,
        vx: (Math.random() - 0.5) * 4.5,
        vy: -Math.random() * 5.5 - 3.5,
        scale: Math.random() * 0.4 + 0.8,
        alpha: 1,
        emoji: reaction.emoji,
        rotation: (Math.random() - 0.5) * 30,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setActiveReactionId(null);
    }, 250);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 30,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
              opacity: p.alpha,
              fontSize: 22,
              filter: "drop-shadow(0 4px 10px rgba(255, 106, 77, 0.6))",
              userSelect: "none",
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 28,
          background: "rgba(18, 20, 24, 0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: `
            0 16px 40px -10px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 4px 20px -2px rgba(230, 83, 60, 0.18)
          `,
          width: "min(92vw, 420px)",
        }}
      >
        {DEFAULT_REACTIONS.map((item) => {
          const isSelected = activeReactionId === item.id;
          const currentScale = scales[item.id] || 1;

          return (
            <button
              key={item.id}
              onClick={(e) => handleReactionPress(item, e)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 4px",
                borderRadius: 20,
                background: isSelected ? "rgba(255, 106, 77, 0.18)" : "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                transform: `scale(${currentScale})`,
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSelected
                  ? "rgba(255, 106, 77, 0.18)"
                  : "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  lineHeight: 1,
                  filter: isSelected
                    ? "drop-shadow(0 0 12px rgba(255, 106, 77, 0.85))"
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              >
                {item.emoji}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: isSelected ? "#FF6A4D" : "rgba(255, 255, 255, 0.65)",
                  marginTop: 4,
                  letterSpacing: "-0.01em",
                }}
              >
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
