"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * Discord Icon Component (Clean Vector SVG)
 */
function DiscordIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/**
 * CommunitySection
 * Active Community showcase block connected to the live Discord API.
 * Features:
 *  - Eyebrow tag: "COMUNIDAD ACTIVA" with wide tracking
 *  - Dynamic live stat +totalMembers in DynaPuff Ember glow
 *  - Subtitle: "miembros en Discord"
 *  - Official invite link https://discord.gg/G32qsbs249
 *  - Dynamic live presence pill showing onlineMembers
 */
export function CommunitySection() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [stats, setStats] = useState<{ totalMembers: number; onlineMembers: number }>({
    totalMembers: 1400,
    onlineMembers: 147,
  });

  useEffect(() => {
    let active = true;

    fetch("/api/discord")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (typeof data.totalMembers === "number" && typeof data.onlineMembers === "number") {
          setStats({
            totalMembers: data.totalMembers,
            onlineMembers: data.onlineMembers,
          });
        }
      })
      .catch((err) => {
        console.warn("[pandly/community] Live Discord stats fetch failed:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="community"
      style={{
        position: "relative",
        padding: "clamp(80px, 12vh, 140px) 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* Background ambient refraction halo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(90vw, 700px)",
          height: 380,
          background: "radial-gradient(ellipse at center, rgba(88, 101, 242, 0.14) 0%, rgba(255, 106, 77, 0.08) 45%, transparent 75%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Centered Glass Community Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(92vw, 840px)",
          borderRadius: 36,
          padding: "clamp(40px, 6vw, 68px) clamp(24px, 5vw, 56px)",
          background: "radial-gradient(ellipse at top, rgba(255, 106, 77, 0.12) 0%, rgba(18, 20, 24, 0.88) 60%, rgba(10, 11, 14, 0.98) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 106, 77, 0.28)",
          boxShadow: `
            0 32px 80px -16px rgba(0, 0, 0, 0.92),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset,
            0 0 56px -12px rgba(230, 83, 60, 0.22)
          `,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Eyebrow / Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 999,
            background: "rgba(255, 106, 77, 0.12)",
            border: "1px solid rgba(255, 106, 77, 0.35)",
            color: "#FF6A4D",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 20,
            boxShadow: "0 0 24px rgba(230, 83, 60, 0.2)",
          }}
        >
          <Sparkles size={14} />
          <span>COMUNIDAD ACTIVA</span>
        </div>

        {/* Big Stat Number (Dynamic) */}
        <div
          style={{
            fontFamily: "var(--font-dyna-puff), cursive",
            fontSize: "clamp(3.6rem, 8.5vw, 5.8rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: "0 0 8px 0",
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #FFFFFF 25%, #FF6A4D 70%, #E6533C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 28px rgba(255, 106, 77, 0.6))",
          }}
        >
          +{stats.totalMembers > 0 ? stats.totalMembers.toLocaleString() : "1,400"}
        </div>

        {/* Subtitle */}
        <h3
          style={{
            fontFamily: "var(--font-lilita-one), sans-serif",
            fontSize: "clamp(1.25rem, 2.6vw, 1.65rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            margin: "0 0 20px 0",
            letterSpacing: "0.01em",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          miembros en Discord
        </h3>

        {/* Copy Descriptivo */}
        <p
          style={{
            fontFamily: "var(--font-lilita-one), sans-serif",
            fontSize: "clamp(0.98rem, 1.8vw, 1.15rem)",
            lineHeight: 1.65,
            color: "#A9B0BC",
            maxWidth: 640,
            margin: "0 auto 36px auto",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
          }}
        >
          La Comunidad de Pandly es el corazón del proyecto. Participa directamente en el desarrollo, sugiere funciones, prueba las salas de cine y rol antes que nadie, y da forma a cada actualización.
        </p>

        {/* Botón Principal CTA Discord */}
        <a
          href="https://discord.gg/G32qsbs249"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 36px",
            borderRadius: 999,
            background: btnHovered
              ? "linear-gradient(135deg, #6775F8 0%, #5865F2 100%)"
              : "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
            color: "#FFFFFF",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 16,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: btnHovered
              ? "0 18px 48px -4px rgba(88, 101, 242, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.35) inset"
              : "0 12px 36px -6px rgba(88, 101, 242, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
            transform: btnHovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <DiscordIcon size={22} />
          <span>Unirse al Discord</span>
          <ArrowRight size={18} />
        </a>

        {/* Pill de Presencia en Vivo (Dynamic) */}
        <div
          style={{
            marginTop: 28,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(14, 16, 20, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#06D6A0",
              boxShadow: "0 0 10px #06D6A0",
              display: "inline-block",
              animation: "pulse 2s infinite ease-in-out",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.85)",
              letterSpacing: "0.01em",
            }}
          >
            {stats.onlineMembers > 0 ? stats.onlineMembers.toLocaleString() : "147"} miembros en línea ahora
          </span>
        </div>
      </div>
    </section>
  );
}
