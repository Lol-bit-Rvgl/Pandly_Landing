"use client";

import React from "react";
import { GlassCanvas } from "./GlassCanvas";
import { TopProgressHeader } from "../components/TopProgressHeader";
import { HeroSpace } from "../components/HeroSpace";
import { FeedShowcase } from "../components/FeedShowcase";
import { ReactionPicker } from "../components/ReactionPicker";
import { PhysicsInspector } from "../components/PhysicsInspector";
import { CommunitySection } from "../components/CommunitySection";
import { Footer } from "../components/Footer";
import {
  Sparkles,
  Compass,
  Film,
  Mic,
  Smile,
  Gamepad2,
  Wand2,
  Headphones,
} from "lucide-react";

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

      {/* Persistent Zero-Reflow Top Progress Header */}
      <TopProgressHeader />

      {/* Optional Minimalist Easter Egg HUD */}
      <PhysicsInspector />

      {/* 1. HERO SECTION (id="home") */}
      <HeroSpace />

      {/* Vignette Transition Hero -> Features */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: "100%",
          height: "1px",
          background: "radial-gradient(ellipse at 50% 50%, rgba(230, 83, 60, 0.28) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. THE 5 CORE PILLARS / BENTO ASIMÉTRICO (id="features") */}
      <section
        id="features"
        style={{
          position: "relative",
          padding: "clamp(100px, 14vh, 180px) 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 780, marginBottom: "clamp(48px, 6vw, 72px)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(255, 106, 77, 0.12)",
              border: "1px solid rgba(255, 106, 77, 0.3)",
              color: "#FF6A4D",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} />
            <span>Diseñado para Conectar de Verdad</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff), cursive",
              fontSize: "clamp(2.1rem, 4.4vw, 3.6rem)",
              fontWeight: 700,
              margin: "0 0 16px 0",
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            Todo lo que amas hacer con amigos, en un solo lugar
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one), sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "#A9B0BC",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Olvídate de las apps frías y solitarias. En Pandly la pantalla está viva y cada segundo compartido se siente cercano.
          </p>
        </div>

        {/* Asymmetric Bento Cadence */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "min(94vw, 1140px)",
          }}
        >
          {/* Row 1: Spotlight Full-Width (Roleplay Rooms & Mundos Vivos) */}
          <div
            style={{
              position: "relative",
              borderRadius: 32,
              padding: "clamp(32px, 4vw, 48px)",
              background: "radial-gradient(ellipse at top right, rgba(255, 106, 77, 0.12) 0%, rgba(18, 20, 24, 0.85) 70%)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 106, 77, 0.3)",
              boxShadow: "0 24px 60px -16px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
              alignItems: "center",
              overflow: "hidden",
              transition: "transform 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.3)";
            }}
          >
            <div>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 24px rgba(230, 83, 60, 0.45)",
                }}
              >
                <Gamepad2 size={28} color="#FFF" />
              </div>

              <div
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontFamily: "var(--font-dyna-puff)",
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "rgba(230, 83, 60, 0.2)",
                  color: "#FF6A4D",
                  marginBottom: 10,
                }}
              >
                EXPERIENCIA ESTRELLA
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                  margin: "0 0 14px 0",
                  color: "#FFF",
                  lineHeight: 1.2,
                }}
              >
                🎭 Roleplay Rooms & Espacios Vivos
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-lilita-one)",
                  fontSize: 15,
                  color: "#A9B0BC",
                  lineHeight: 1.65,
                  margin: "0 0 24px 0",
                  maxWidth: 520,
                }}
              >
                Crea mundos interactivos con físicas de resorte en tiempo real, personaliza tu avatar con profundidad 2.5D y rolea en escenarios dinámicos con tus amigos sin límites.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(255, 255, 255, 0.06)", color: "#FFF", fontFamily: "var(--font-dyna-puff)" }}>
                  #Fantasía
                </span>
                <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(255, 255, 255, 0.06)", color: "#FFF", fontFamily: "var(--font-dyna-puff)" }}>
                  #Cyberpunk
                </span>
                <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(255, 255, 255, 0.06)", color: "#FFF", fontFamily: "var(--font-dyna-puff)" }}>
                  #AnimeLive
                </span>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(10, 11, 14, 0.7)",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 220,
              }}
            >
              <img
                src="/assets/images/Panda_Head.png"
                alt="Panda Avatar"
                style={{
                  width: 88,
                  height: 88,
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 24px rgba(230, 83, 60, 0.5))",
                  marginBottom: 12,
                }}
              />
              <div style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 14, color: "#FFF" }}>
                Sala: Academia Estelar #1
              </div>
              <div style={{ fontFamily: "var(--font-lilita-one)", fontSize: 12, color: "#06D6A0", marginTop: 4 }}>
                ● 14 roleplayers activos en vivo
              </div>
            </div>
          </div>

          {/* Row 2: Symmetric Duo (Watch Parties + Voice Lounges) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              width: "100%",
            }}
          >
            {/* Card: Watch Parties */}
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                padding: "36px 30px",
                background: "rgba(18, 20, 24, 0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255, 77, 109, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #FF4D6D 0%, #C63D2F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 24px rgba(255, 77, 109, 0.35)",
                }}
              >
                <Film size={26} color="#FFF" />
              </div>

              <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 21, margin: "0 0 12px 0", color: "#FFF" }}>
                🍿 Salas de Cine Compartidas
              </h3>

              <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
                Mira series, videos y películas juntos con audio sincronizado al milisegundo y reacciones que explotan en pantalla en tiempo real.
              </p>
            </div>

            {/* Card: Voice Lounges */}
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                padding: "36px 30px",
                background: "rgba(18, 20, 24, 0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(6, 214, 160, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #06D6A0 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 24px rgba(6, 214, 160, 0.35)",
                }}
              >
                <Headphones size={26} color="#FFF" />
              </div>

              <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 21, margin: "0 0 12px 0", color: "#FFF" }}>
                🎙️ Voice Lounges con Audio Espacial
              </h3>

              <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
                Salta a salas de voz espontáneas con sonido envolvente y micro-interacciones táctiles mientras navegas por tus círculos.
              </p>
            </div>
          </div>

          {/* Row 3: Community Duo (Círculos & Living Stickers) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              width: "100%",
            }}
          >
            {/* Card: Círculos */}
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                padding: "36px 30px",
                background: "rgba(18, 20, 24, 0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(240, 138, 91, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #F08A5B 0%, #E6533C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 24px rgba(240, 138, 91, 0.35)",
                }}
              >
                <Compass size={26} color="#FFF" />
              </div>

              <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 21, margin: "0 0 12px 0", color: "#FFF" }}>
                ⭕ Círculos & Comunidades
              </h3>

              <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
                Encuentra tribus dedicadas a tus intereses, fandoms, gaming y creación de contenido sin algoritmos tóxicos ni muros de pago.
              </p>
            </div>

            {/* Card: 523 Living Stickers */}
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                padding: "36px 30px",
                background: "rgba(18, 20, 24, 0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
                transition: "transform 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255, 209, 102, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #FFD166 0%, #F08A5B 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: "0 8px 24px rgba(255, 209, 102, 0.35)",
                }}
              >
                <Smile size={26} color="#000" />
              </div>

              <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 21, margin: "0 0 12px 0", color: "#FFF" }}>
                ✨ 523 Living Stickers Táctiles
              </h3>

              <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
                Exprésate con stickers que reaccionan al tacto, vibran y tienen peso físico real al deslizarse por la pantalla con resortes P3.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vignette Transition Features -> Circles */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: "100%",
          height: "1px",
          background: "radial-gradient(ellipse at 50% 50%, rgba(230, 83, 60, 0.22) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* 3. CIRCLES SHOWCASE SECTION (id="circles") */}
      <section
        id="circles"
        style={{
          position: "relative",
          padding: "clamp(110px, 15vh, 200px) 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 760, marginBottom: "clamp(48px, 6vw, 68px)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
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
            <span>Espacios Creados por y para Fans</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff), cursive",
              fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
              fontWeight: 700,
              margin: "0 0 16px 0",
              color: "#FFFFFF",
            }}
          >
            Descubre tus Nuevos Círculos
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one), sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
              color: "#A9B0BC",
              margin: 0,
            }}
          >
            Comunidades vivas donde siempre hay alguien conectado en una sala de cine, rol o debate.
          </p>
        </div>

        {/* Circles Bento Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            width: "min(94vw, 1140px)",
          }}
        >
          {[
            {
              title: "#RoleplayUniverse",
              members: "14.2k roleplayers activos",
              desc: "Salas de rol de fantasía, cyberpunk y anime con escenarios interactivos y música ambiental.",
              image: "/assets/Post_Mockups/gato_estrella.jpg",
              tag: "SALA EN VIVO 🎭",
            },
            {
              title: "#AnimeCinemaClub",
              members: "28.9k espectadores",
              desc: "Watch parties todos los viernes y fines de semana con chat interactivo y palomitas virtuales.",
              image: "/assets/Post_Mockups/miss_head.jpg",
              tag: "CINE NOCTURNO 🍿",
            },
            {
              title: "#LivingStickersLab",
              members: "11.5k creadores",
              desc: "Diseña, comparte y colecciona stickers personalizados para usar en chats y reacciones.",
              image: "/assets/Post_Mockups/rabbid_meme_2.jpg",
              tag: "CREATIVO ✨",
            },
          ].map((circle, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                borderRadius: 26,
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
              <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
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
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "rgba(230, 83, 60, 0.9)",
                    backdropFilter: "blur(8px)",
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#FFF",
                  }}
                >
                  {circle.tag}
                </span>
              </div>

              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 20,
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
                    color: "rgba(255, 255, 255, 0.65)",
                    lineHeight: 1.55,
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

      {/* 4. PRODUCT FEED SHOWCASE (id="feed") */}
      <FeedShowcase />

      {/* 5. FLOATING LIVING REACTION PICKER DEMO */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          marginTop: "-20px",
          marginBottom: "clamp(60px, 10vh, 120px)",
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
          <span>Toca una reacción y siente su rebote elástico</span>
        </div>
        <ReactionPicker />
      </div>

      {/* 6. CREATE / STICKER & ROOM STUDIO (id="create") */}
      <section
        id="create"
        style={{
          position: "relative",
          padding: "clamp(100px, 14vh, 180px) 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "min(94vw, 960px)",
            borderRadius: 36,
            padding: "clamp(44px, 5vw, 68px) clamp(24px, 4vw, 52px)",
            background: "radial-gradient(ellipse at top, rgba(230, 83, 60, 0.18) 0%, rgba(18, 20, 24, 0.88) 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 106, 77, 0.35)",
            boxShadow: "0 24px 60px -12px rgba(230, 83, 60, 0.25)",
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
            <span>Pandly Creator Suite</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
              margin: "0 0 16px 0",
              color: "#FFF",
            }}
          >
            Crea Salas de Rol y Stickers Únicos
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 16,
              color: "#A9B0BC",
              maxWidth: 620,
              margin: "0 auto 34px auto",
              lineHeight: 1.6,
            }}
          >
            Diseña escenarios para tus historias, sube tus packs de stickers con físicas personalizadas y hospeda salas donde tus amigos no querrán desconectarse.
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
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Crear mi Primera Sala
          </button>
        </div>
      </section>

      {/* 7. CHATS & VOICE LOUNGES WITH PRESENCE (id="chats") */}
      <section
        id="chats"
        style={{
          position: "relative",
          padding: "clamp(100px, 14vh, 180px) 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 680, marginBottom: "clamp(40px, 5vw, 56px)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(6, 214, 160, 0.12)",
              border: "1px solid rgba(6, 214, 160, 0.25)",
              color: "#06D6A0",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            <Mic size={14} />
            <span>Presencia e Inmersión en Tiempo Real</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
              margin: "0 0 12px 0",
              color: "#FFF",
            }}
          >
            Salas de Voz y Chats Vivos
          </h2>
          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 15,
              color: "#A9B0BC",
              margin: 0,
            }}
          >
            Siente cuándo tus amigos entran a la sala, susurran o celebran una victoria juntos.
          </p>
        </div>

        {/* Demo Chat Box */}
        <div
          style={{
            width: "min(92vw, 520px)",
            borderRadius: 28,
            padding: 24,
            background: "rgba(18, 20, 24, 0.82)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
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
                <div style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 15, color: "#FFF" }}>
                  Pomni • Sala de Rol #2
                </div>
                <div style={{ fontFamily: "var(--font-lilita-one)", fontSize: 12, color: "#06D6A0" }}>
                  ● En llamada con 6 amigos
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                background: "rgba(6, 214, 160, 0.15)",
                color: "#06D6A0",
                fontFamily: "var(--font-dyna-puff)",
                fontSize: 11,
              }}
            >
              AUDIO HD
            </div>
          </div>

          <div
            style={{
              padding: "16px 20px",
              borderRadius: 20,
              background: "rgba(230, 83, 60, 0.18)",
              border: "1px solid rgba(255, 106, 77, 0.3)",
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 14,
              color: "#FFF",
              lineHeight: 1.45,
            }}
          >
            "¡Chicos, ya empezó la película en la sala de cine! Vengan que guardé asientos virtuales para todos 🍿✨"
          </div>
        </div>
      </section>

      {/* 8. PROFILE & IDENTITY (id="profile") */}
      <section
        id="profile"
        style={{
          position: "relative",
          padding: "clamp(90px, 14vh, 160px) 24px clamp(140px, 18vh, 220px) 24px",
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
            maxWidth: 540,
            padding: "clamp(32px, 5vw, 44px)",
            borderRadius: 32,
            background: "rgba(18, 20, 24, 0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              margin: "0 auto 18px auto",
              overflow: "hidden",
              border: "3px solid #FF6A4D",
              boxShadow: "0 0 28px rgba(230, 83, 60, 0.5)",
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
              fontSize: 26,
              margin: "0 0 6px 0",
              color: "#FFF",
            }}
          >
            Tu Identidad, Tus Reglas
          </h3>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 13,
              color: "#FF6A4D",
              margin: "0 0 16px 0",
            }}
          >
            Avatares 2.5D • Badges de Círculo • Insignias de Rol
          </p>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.65)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Personaliza tu perfil, colecciona stickers exclusivos de cada sala y muestra tus mundos favoritos a la comunidad.
          </p>
        </div>
      </section>

      {/* 7. COMUNIDAD ACTIVA (Inspirado en Kyubi) */}
      <CommunitySection />

      {/* FOOTER INSTITUCIONAL PANDLY INC. */}
      <Footer />
    </main>
  );
}
