"use client";

import React from "react";
import { GlassCanvas } from "./GlassCanvas";
import { HeroSpace } from "../components/HeroSpace";
import { FeedShowcase } from "../components/FeedShowcase";
import { ReactionPicker } from "../components/ReactionPicker";
import { LiquidDock } from "../components/LiquidDock";
import { PhysicsInspector } from "../components/PhysicsInspector";
import { Sparkles, Compass, Flame, Users, Layers, Wand2, Shield, Heart, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        background: "#000000",
        color: "#FFFFFF",
        overflowX: "hidden",
      }}
    >
      {/* Background Liquid Glass Engine Canvas */}
      <GlassCanvas />

      {/* Physics & Shader Live Inspector (Apple-Style HUD) */}
      <PhysicsInspector />

      {/* 1. HERO SECTION ("Pandly Space") */}
      <HeroSpace />

      {/* 2. CIRCLES / EXPLORE SECTION */}
      <section
        id="circles"
        style={{
          position: "relative",
          padding: "100px 20px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 760, marginBottom: 48 }}>
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
            <Compass size={14} />
            <span>Living Communities</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff), cursive",
              fontSize: "clamp(2rem, 4.2vw, 3.2rem)",
              fontWeight: 700,
              margin: "0 0 16px 0",
              color: "#FFFFFF",
            }}
          >
            Círculos y Espacios Vivos
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one), sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "#A9B0BC",
              margin: 0,
            }}
          >
            Comunidades orgánicas impulsadas por presencia en tiempo real y reacciones colectivas.
          </p>
        </div>

        {/* Circles Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            width: "min(94vw, 1040px)",
          }}
        >
          {[
            {
              title: "#LivingStickers",
              members: "14.2k miembros",
              desc: "Diseño y animación elástica de stickers con WebAssembly y shaders de refracción.",
              image: "/assets/Post_Mockups/gato_estrella.jpg",
              tag: "POPULAR",
            },
            {
              title: "#AwwwardsCreative",
              members: "8.9k miembros",
              desc: "Desarrollo de motion design, física de resortes no lineales y interfaces de cristal.",
              image: "/assets/Post_Mockups/femboy_ven_pa_aca.jpg",
              tag: "TRENDING",
            },
            {
              title: "#PandlyGamingLab",
              members: "21.5k miembros",
              desc: "Torneos y minijuegos con motores de física Rive y partículas reactivas al cursor.",
              image: "/assets/Post_Mockups/rabbid_meme_2.jpg",
              tag: "LIVE",
            },
          ].map((circle, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                background: "rgba(18, 20, 24, 0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 16px 36px -10px rgba(0, 0, 0, 0.7)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                <img
                  src={circle.image}
                  alt={circle.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(230, 83, 60, 0.85)",
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#FFF",
                  }}
                >
                  {circle.tag}
                </span>
              </div>

              <div style={{ padding: 20 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 18,
                    margin: "0 0 6px 0",
                    color: "#FFF",
                  }}
                >
                  {circle.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-lilita-one)",
                    fontSize: 12,
                    color: "#FF6A4D",
                    margin: "0 0 10px 0",
                  }}
                >
                  {circle.members}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-lilita-one)",
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {circle.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT FEED SHOWCASE & REACTION PICKER */}
      <FeedShowcase />

      {/* Floating Reaction Picker Section */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          marginTop: -40,
          marginBottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dyna-puff)",
            fontSize: 13,
            color: "#A9B0BC",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={14} color="#FF6A4D" />
          <span>Prueba las reacciones elásticas en tiempo real</span>
        </div>
        <ReactionPicker />
      </div>

      {/* 4. CREATE / STICKER LAB SECTION */}
      <section
        id="create"
        style={{
          position: "relative",
          padding: "100px 20px",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "min(94vw, 920px)",
            borderRadius: 32,
            padding: "48px 36px",
            background: "radial-gradient(ellipse at top, rgba(230, 83, 60, 0.15) 0%, rgba(18, 20, 24, 0.85) 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 106, 77, 0.3)",
            boxShadow: "0 24px 60px -12px rgba(230, 83, 60, 0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255, 106, 77, 0.2)",
              color: "#FF6A4D",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            <Wand2 size={16} />
            <span>Sticker Studio Engine</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
              margin: "0 0 16px 0",
              color: "#FFF",
            }}
          >
            Crea Stickers con Vida Propia
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 16,
              color: "#A9B0BC",
              maxWidth: 580,
              margin: "0 auto 32px auto",
              lineHeight: 1.6,
            }}
          >
            Dibuja, sube tus ilustraciones y ajusta los parámetros de masa ($m$), rigidez ($k$) y amortiguación ($\zeta$) para que reaccionen a la gravedad y a los toques de tu comunidad.
          </p>

          <button
            style={{
              padding: "16px 36px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
              color: "#FFF",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(230, 83, 60, 0.5)",
            }}
          >
            Abrir Sticker Studio
          </button>
        </div>
      </section>

      {/* 5. CHAT & PRESENCE SECTION */}
      <section
        id="chats"
        style={{
          position: "relative",
          padding: "90px 20px",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 640, marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              margin: "0 0 12px 0",
              color: "#FFF",
            }}
          >
            Presencia Líquida en Chats
          </h2>
          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 15,
              color: "#A9B0BC",
              margin: 0,
            }}
          >
            Burbujas dinámicas que respiran y vibran con los estados de ánimo de tus amigos.
          </p>
        </div>

        {/* Demo Chat Preview Pill */}
        <div
          style={{
            width: "min(92vw, 480px)",
            borderRadius: 24,
            padding: 20,
            background: "rgba(18, 20, 24, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #FF6A4D",
              }}
            >
              <img
                src="/assets/Post_Mockups/pomni_profile.jpg"
                alt="Pomni"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 14, color: "#FFF" }}>
                Pomni (Digital Circus)
              </div>
              <div style={{ fontFamily: "var(--font-lilita-one)", fontSize: 11, color: "#06D6A0" }}>
                ● Escribiendo sticker...
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 18px",
              borderRadius: 18,
              background: "rgba(230, 83, 60, 0.18)",
              border: "1px solid rgba(255, 106, 77, 0.3)",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 14,
              color: "#FFF",
              lineHeight: 1.4,
            }}
          >
            "¡Mira este nuevo shader que compilamos a WASM! Los reflejos de borde son increíbles 🔥"
          </div>
        </div>
      </section>

      {/* 6. PROFILE SECTION */}
      <section
        id="profile"
        style={{
          position: "relative",
          padding: "80px 20px 140px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 500,
            padding: 32,
            borderRadius: 28,
            background: "rgba(18, 20, 24, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              margin: "0 auto 16px auto",
              overflow: "hidden",
              border: "3px solid #FF6A4D",
              boxShadow: "0 0 24px rgba(230, 83, 60, 0.4)",
            }}
          >
            <img
              src="/assets/images/Panda_Head.png"
              alt="Panda Avatar"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <h3
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 22,
              margin: "0 0 6px 0",
              color: "#FFF",
            }}
          >
            Red Panda Explorer
          </h3>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 13,
              color: "#FF6A4D",
              margin: "0 0 16px 0",
            }}
          >
            Nivel 42 • Creador Certificado
          </p>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Coleccionista de micro-interacciones y embajador de la física óptica en Pandly.
          </p>
        </div>
      </section>

      {/* Floating Liquid Navigation Dock */}
      <LiquidDock />
    </main>
  );
}
