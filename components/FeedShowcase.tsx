"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Grid, Layout, Smartphone, Type, Heart, MessageCircle, Share2, Sparkles, Flame, Eye } from "lucide-react";
import { useLiquidEngine } from "../hooks/useLiquidEngine";

export type PostFormat = "grid" | "cover" | "vertical" | "text";

interface FormatInfo {
  id: PostFormat;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const FORMATS: FormatInfo[] = [
  {
    id: "grid",
    title: "Grid Collage",
    subtitle: "Mosaico Dinámico 2.5D",
    icon: Grid,
    description: "Distribución fluida con curvatura superelíptica adaptativa y refracción por celda.",
  },
  {
    id: "cover",
    title: "Cinematic Cover",
    subtitle: "Tarjeta de Impacto",
    icon: Layout,
    description: "Capa de vidrio polarizada con profundidad focal $C_{glass}$ y tipografía en relieve.",
  },
  {
    id: "vertical",
    title: "Vertical Story",
    subtitle: "Formato 9:16 Inmersivo",
    icon: Smartphone,
    description: "Aspect ratio móvil con pills de reacción flotantes y halo de dispersión cromática.",
  },
  {
    id: "text",
    title: "Sticker Typography",
    subtitle: "Expresión Conversacional",
    icon: Type,
    description: "Tipografía viva con sombreado de sticker, física jelly y shaders de textura.",
  },
];

export function FeedShowcase() {
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>("grid");
  const [likes, setLikes] = useState<Record<string, number>>({
    grid: 142,
    cover: 389,
    vertical: 624,
    text: 89,
  });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const cardElementRef = useRef<HTMLDivElement | null>(null);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0, fresnelGlow: 0.04 });

  const { registerLens, removeLens } = useLiquidEngine();

  // Register the active showcase card as GlassLens
  useEffect(() => {
    if (!cardElementRef.current) return;

    const lens = registerLens({
      id: `feed-card-${selectedFormat}`,
      element: cardElementRef.current,
      tokens: {
        distortion: 0.14,
        distortionWidth: 28.0,
        chromaticAberration: 0.0038,
        lightIntensity: 0.9,
        cornerRadius: 24.0,
        refractiveIndex: 1.54,
      },
    });

    return () => {
      if (lens) removeLens(lens);
    };
  }, [selectedFormat, registerLens, removeLens]);

  // Handle 2.5D optical tilt & Fresnel calculations
  const handleCardPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardElementRef.current) return;
    const rect = cardElementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    const rotY = normX * 12;
    const rotX = -normY * 12;

    // Fresnel calculation: F = F0 + (1-F0)*(1 - N.V)^5
    const distNorm = Math.sqrt(normX * normX + normY * normY);
    const nDotV = Math.sqrt(Math.max(0.1, 1 - distNorm * 0.45));
    const fresnel = 0.04 + (1 - 0.04) * Math.pow(1 - nDotV, 5);

    setCardTilt({
      rotateX: rotX,
      rotateY: rotY,
      fresnelGlow: fresnel,
    });
  }, []);

  const handleCardPointerLeave = useCallback(() => {
    setCardTilt({ rotateX: 0, rotateY: 0, fresnelGlow: 0.04 });
  }, []);

  const handleToggleLike = (format: string) => {
    const isLiked = !hasLiked[format];
    setHasLiked((prev) => ({ ...prev, [format]: isLiked }));
    setLikes((prev) => ({
      ...prev,
      [format]: prev[format] + (isLiked ? 1 : -1),
    }));
  };

  return (
    <section
      id="feed"
      ref={cardContainerRef}
      style={{
        position: "relative",
        padding: "120px 20px",
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #000000 0%, #101216 50%, #000000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 15,
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", maxWidth: 720, marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            background: "rgba(230, 83, 60, 0.12)",
            border: "1px solid rgba(255, 106, 77, 0.25)",
            color: "#FF6A4D",
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          <Sparkles size={14} />
          <span>Interactive Product Feed</span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-dyna-puff), cursive",
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            fontWeight: 700,
            margin: "0 0 16px 0",
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
          }}
        >
          4 Formatos. Infinita Expresión.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-lilita-one), sans-serif",
            fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
            color: "#A9B0BC",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Cada publicación vive dentro de una lente de refracción 2.5D con física de masa y rigidez calibradas.
        </p>
      </div>

      {/* Format Selector Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px",
          borderRadius: 24,
          background: "rgba(23, 25, 29, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: 44,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon;
          const isSelected = selectedFormat === fmt.id;

          return (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 18,
                background: isSelected
                  ? "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)"
                  : "transparent",
                color: isSelected ? "#FFFFFF" : "#A9B0BC",
                border: "none",
                fontFamily: "var(--font-dyna-puff)",
                fontSize: 14,
                fontWeight: isSelected ? 600 : 400,
                cursor: "pointer",
                boxShadow: isSelected
                  ? "0 6px 20px -4px rgba(230, 83, 60, 0.6)"
                  : "none",
                transform: isSelected ? "scale(1.03)" : "scale(1.0)",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                outline: "none",
              }}
            >
              <Icon size={16} />
              <span>{fmt.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive 3D Card Stage */}
      <div
        style={{
          perspective: 1200,
          width: "min(94vw, 560px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          ref={cardElementRef}
          onPointerMove={handleCardPointerMove}
          onPointerLeave={handleCardPointerLeave}
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 28,
            background: "rgba(18, 20, 24, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: `
              0 24px 60px -16px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 0 ${40 * cardTilt.fresnelGlow}px rgba(255, 106, 77, ${(cardTilt.fresnelGlow * 0.8).toFixed(2)})
            `,
            transform: `
              rotateX(${cardTilt.rotateX}deg)
              rotateY(${cardTilt.rotateY}deg)
              scale(1.01)
            `,
            transition: "transform 0.12s ease-out, box-shadow 0.15s ease",
            overflow: "hidden",
            padding: 24,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card Header (Author info & presence) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #FF6A4D",
                  padding: 1,
                  background: "#000",
                }}
              >
                <img
                  src="/assets/Post_Mockups/aura_poderosa_profile.jpg"
                  alt="Author Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>Aura Star</span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(255, 106, 77, 0.2)",
                      color: "#FF6A4D",
                    }}
                  >
                    PRO
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-lilita-one)",
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.45)",
                  }}
                >
                  hace 12m en #LivingDesign
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-dyna-puff)",
                fontSize: 11,
                padding: "6px 12px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#FF6A4D",
              }}
            >
              F = {(cardTilt.fresnelGlow).toFixed(3)}
            </div>
          </div>

          {/* Dynamic Post Format Body */}
          {selectedFormat === "grid" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", height: 160, position: "relative" }}>
                <img
                  src="/assets/Post_Mockups/gato_estrella.jpg"
                  alt="Gato Estrella"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ borderRadius: 16, overflow: "hidden", height: 160, position: "relative" }}>
                <img
                  src="/assets/Post_Mockups/charlie_profile.jpg"
                  alt="Charlie"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ gridColumn: "span 2", borderRadius: 16, overflow: "hidden", height: 140, position: "relative" }}>
                <img
                  src="/assets/Post_Mockups/lolbit_profile.jpg"
                  alt="Lolbit"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {selectedFormat === "cover" && (
            <div style={{ borderRadius: 20, overflow: "hidden", height: 280, position: "relative", marginBottom: 18 }}>
              <img
                src="/assets/Post_Mockups/miss_head.jpg"
                alt="Cinematic Cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 20,
                }}
              >
                <div style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 18, color: "#FFF" }}>
                  Living Universe • Edición Limitada
                </div>
              </div>
            </div>
          )}

          {selectedFormat === "vertical" && (
            <div style={{ borderRadius: 20, overflow: "hidden", height: 340, position: "relative", marginBottom: 18 }}>
              <img
                src="/assets/Post_Mockups/rabbid_coding_profile.jpg"
                alt="Vertical Story"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(10px)",
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 11,
                  color: "#FF6A4D",
                }}
              >
                9:16 LIVE
              </div>
            </div>
          )}

          {selectedFormat === "text" && (
            <div
              style={{
                borderRadius: 20,
                padding: "24px 20px",
                background: "linear-gradient(135deg, rgba(230, 83, 60, 0.15) 0%, rgba(255, 106, 77, 0.05) 100%)",
                border: "1px dashed rgba(255, 106, 77, 0.35)",
                marginBottom: 18,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 20,
                  lineHeight: 1.4,
                  margin: "0 0 12px 0",
                  color: "#FFFFFF",
                }}
              >
                "Los stickers en Pandly no son imágenes estáticas. Son partículas vivas que rebotan con la inercia de tus dedos."
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  fontFamily: "var(--font-lilita-one)",
                  fontSize: 14,
                  color: "#FF6A4D",
                }}
              >
                <span>#StickerPhysics</span>
                <span>#LiquidGlass</span>
                <span>#AwwwardsDesign</span>
              </div>
            </div>
          )}

          {/* Card Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Like Button */}
              <button
                onClick={() => handleToggleLike(selectedFormat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: hasLiked[selectedFormat] ? "rgba(255, 106, 77, 0.2)" : "transparent",
                  border: "none",
                  color: hasLiked[selectedFormat] ? "#FF6A4D" : "#A9B0BC",
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 14,
                  transition: "all 0.15s ease",
                }}
              >
                <Heart
                  size={18}
                  fill={hasLiked[selectedFormat] ? "#FF6A4D" : "none"}
                  strokeWidth={2.2}
                />
                <span>{likes[selectedFormat]}</span>
              </button>

              {/* Comments */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#A9B0BC",
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 13,
                }}
              >
                <MessageCircle size={18} strokeWidth={2} />
                <span>34</span>
              </div>
            </div>

            {/* Share */}
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#A9B0BC",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
