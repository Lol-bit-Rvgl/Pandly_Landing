"use client";

import React, { useState } from "react";
import { Download, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

/**
 * DownloadBanner Component
 * Official Pandly App download card banner.
 * Features:
 *  - Main Headline: "Donde tu identidad se vuelve real"
 *  - Subtitle: "Salas de cine sincronizadas, chats de voz interactivos y círculos donde tu identidad cobra vida." (#E2E8F0 for WCAG AA compliance)
 *  - CTA Button: "Descargar APK" with generous padding and Ember glow (#FF6A4D / #E6533C)
 *  - Trust pill: Android APK Directo, verificado y seguro
 */
export function DownloadBanner() {
  const [btnHovered, setBtnHovered] = useState(false);

  const handleDownloadClick = () => {
    // Direct APK download link or beta build hook
    window.open("https://github.com/Lol-bit-Rvgl/Pandly_Landing/releases/latest", "_blank");
  };

  return (
    <section
      id="download"
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
      {/* Background ambient refraction glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(92vw, 860px)",
          height: 420,
          background:
            "radial-gradient(ellipse at center, rgba(255, 106, 77, 0.16) 0%, rgba(230, 83, 60, 0.08) 40%, transparent 70%)",
          filter: "blur(64px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Glass Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(94vw, 920px)",
          borderRadius: 36,
          padding: "clamp(44px, 6vw, 72px) clamp(24px, 5vw, 60px)",
          background:
            "radial-gradient(ellipse at top center, rgba(255, 106, 77, 0.15) 0%, rgba(18, 20, 24, 0.9) 60%, rgba(8, 9, 12, 0.98) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 106, 77, 0.32)",
          boxShadow: `
            0 32px 80px -16px rgba(0, 0, 0, 0.95),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 0 60px -12px rgba(230, 83, 60, 0.28)
          `,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Panda Mascot Avatar with Glow */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            margin: "0 auto 20px auto",
            overflow: "hidden",
            border: "3px solid #FF6A4D",
            boxShadow: "0 0 32px rgba(230, 83, 60, 0.6)",
            background: "rgba(18, 20, 24, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/Panda_Head.png"
            alt="Pandly Mascot"
            style={{ width: "88%", height: "88%", objectFit: "contain" }}
          />
        </div>

        {/* Eyebrow / Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 22px",
            borderRadius: 999,
            background: "rgba(255, 106, 77, 0.14)",
            border: "1px solid rgba(255, 106, 77, 0.35)",
            color: "#FF6A4D",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 20,
            boxShadow: "0 0 24px rgba(230, 83, 60, 0.22)",
          }}
        >
          <Sparkles size={14} />
          <span>DESCARGA OFICIAL • ANDROID APK</span>
        </div>

        {/* Titular Principal */}
        <h2
          style={{
            fontFamily: "var(--font-dyna-puff), cursive",
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 16px 0",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
            textShadow: `
              0 0 35px rgba(230, 83, 60, 0.5),
              0 0 70px rgba(255, 106, 77, 0.25),
              0 4px 14px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          Donde tu identidad{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #FFFFFF 20%, #FF6A4D 65%, #E6533C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            se vuelve real
          </span>
        </h2>

        {/* Subtítulo Descriptivo (Alto Contraste WCAG AA #E2E8F0) */}
        <p
          style={{
            fontFamily: "var(--font-lilita-one), sans-serif",
            fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
            lineHeight: 1.65,
            color: "#E2E8F0",
            maxWidth: 680,
            margin: "0 auto 36px auto",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
          }}
        >
          Salas de cine sincronizadas, chats de voz interactivos y círculos donde tu identidad cobra vida.
        </p>

        {/* Botón Principal (CTA): Descargar APK */}
        <button
          onClick={handleDownloadClick}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "18px 44px",
            borderRadius: 999,
            background: btnHovered
              ? "linear-gradient(135deg, #FF7B60 0%, #EA5C45 100%)"
              : "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
            color: "#FFFFFF",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 17,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: btnHovered
              ? "0 18px 48px -4px rgba(255, 106, 77, 0.85), 0 0 0 2px rgba(255, 255, 255, 0.45) inset"
              : "0 14px 40px -6px rgba(230, 83, 60, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.3) inset",
            transform: btnHovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            outline: "none",
          }}
        >
          <Download size={22} />
          <span>Descargar APK</span>
          <ArrowRight size={18} />
        </button>

        {/* Micro-Badges de Seguridad y Compatibilidad */}
        <div
          style={{
            marginTop: 26,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 999,
            background: "rgba(14, 16, 20, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <ShieldCheck size={16} color="#06D6A0" />
          <span
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.8)",
              letterSpacing: "0.02em",
            }}
          >
            APK Oficial v1.2.0 • Android 10+ • Verificado & Seguro
          </span>
        </div>
      </div>
    </section>
  );
}
