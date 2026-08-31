"use client";

import React from "react";
import { GlassCanvas } from "./GlassCanvas";
import { HeroSpace } from "../components/HeroSpace";
import { FeedShowcase } from "../components/FeedShowcase";
import { ReactionPicker } from "../components/ReactionPicker";
import { LiquidDock } from "../components/LiquidDock";
import { PhysicsInspector } from "../components/PhysicsInspector";
import {
  Sparkles,
  Compass,
  Flame,
  Users,
  Film,
  Mic,
  Smile,
  Shield,
  Heart,
  ArrowRight,
  Tv,
  Gamepad2,
  Wand2,
  Headphones,
  CheckCircle2,
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

      {/* Optional Minimalist Easter Egg HUD */}
      <PhysicsInspector />

      {/* 1. HERO SECTION ("Tu espacio para rolear y conectar") */}
      <HeroSpace />

      {/* 2. THE 5 CORE PILLARS / CARACTERÍSTICAS PRINCIPALES */}
      <section
        style={{
          position: "relative",
          padding: "80px 20px 100px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 780, marginBottom: 52 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
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
              fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)",
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
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#A9B0BC",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Olvídate de las apps frías y solitarias. En Pandly la pantalla está viva y cada segundo compartido se siente cercano.
          </p>
        </div>

        {/* 5 Core Feature Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: 20,
            width: "min(94vw, 1120px)",
          }}
        >
          {/* Card 1: Roleplay Rooms */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "32px 28px",
              background: "rgba(18, 20, 24, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
              transition: "transform 0.25s ease, border-color 0.25s ease",
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
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "linear-gradient(135deg, #FF6A4D 0%, #E6533C 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                boxShadow: "0 8px 24px rgba(230, 83, 60, 0.4)",
              }}
            >
              <Gamepad2 size={26} color="#FFF" />
            </div>

            <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 20, margin: "0 0 10px 0", color: "#FFF" }}>
              🎭 Roleplay Rooms & Espacios Vivos
            </h3>

            <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
              Crea mundos interactivos, personaliza tu avatar y rolea en escenarios dinámicos en tiempo real con tus amigos.
            </p>
          </div>

          {/* Card 2: Watch Parties */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "32px 28px",
              background: "rgba(18, 20, 24, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
              transition: "transform 0.25s ease, border-color 0.25s ease",
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

            <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 20, margin: "0 0 10px 0", color: "#FFF" }}>
              🍿 Salas de Cine Compartidas
            </h3>

            <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
              Mira series, videos y películas juntos con audio sincronizado al milisegundo y reacciones que explotan en pantalla.
            </p>
          </div>

          {/* Card 3: Voice Lounges */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "32px 28px",
              background: "rgba(18, 20, 24, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
              transition: "transform 0.25s ease, border-color 0.25s ease",
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

            <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 20, margin: "0 0 10px 0", color: "#FFF" }}>
              🎙️ Voice Lounges con Audio Espacial
            </h3>

            <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
              Salta a salas de voz espontáneas con sonido envolvente y micro-interacciones táctiles mientras navegas.
            </p>
          </div>

          {/* Card 4: Círculos y Comunidades */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "32px 28px",
              background: "rgba(18, 20, 24, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
              transition: "transform 0.25s ease, border-color 0.25s ease",
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

            <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 20, margin: "0 0 10px 0", color: "#FFF" }}>
              ⭕ Círculos & Comunidades
            </h3>

            <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
              Encuentra tribus dedicadas a tus intereses, fandoms, gaming y creación de contenido sin algoritmos tóxicos.
            </p>
          </div>

          {/* Card 5: 523 Living Stickers */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "32px 28px",
              background: "rgba(18, 20, 24, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
              transition: "transform 0.25s ease, border-color 0.25s ease",
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

            <h3 style={{ fontFamily: "var(--font-dyna-puff)", fontSize: 20, margin: "0 0 10px 0", color: "#FFF" }}>
              ✨ 523 Living Stickers Táctiles
            </h3>

            <p style={{ fontFamily: "var(--font-lilita-one)", fontSize: 14, color: "#A9B0BC", lineHeight: 1.6, margin: 0 }}>
              Exprésate con stickers que reaccionan al tacto, vibran y tienen peso físico real al deslizarse por la pantalla.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CIRCLES SHOWCASE SECTION */}
      <section
        id="circles"
        style={{
          position: "relative",
          padding: "90px 20px",
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
            <span>Espacios Creados por y para Fans</span>
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
            Descubre tus Nuevos Círculos
          </h2>

          <p
            style={{
              fontFamily: "var(--font-lilita-one), sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            width: "min(94vw, 1040px)",
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
              <div style={{ height: 170, overflow: "hidden", position: "relative" }}>
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

              <div style={{ padding: 22 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-dyna-puff)",
                    fontSize: 19,
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

      {/* 4. PRODUCT FEED SHOWCASE (4 Formatos) */}
      <FeedShowcase />

      {/* 5. FLOATING LIVING REACTION PICKER DEMO */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          marginTop: -30,
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
          <span>Toca una reacción y siente su rebote elástico</span>
        </div>
        <ReactionPicker />
      </div>

      {/* 6. CREATE / STICKER & ROOM STUDIO */}
      <section
        id="create"
        style={{
          position: "relative",
          padding: "90px 20px",
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
            padding: "52px 36px",
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
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
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

      {/* 7. CHATS & VOICE LOUNGES WITH PRESENCE */}
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
        <div style={{ textAlign: "center", maxWidth: 680, marginBottom: 40 }}>
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
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
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
            width: "min(92vw, 500px)",
            borderRadius: 26,
            padding: 22,
            background: "rgba(18, 20, 24, 0.82)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
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
              padding: "14px 18px",
              borderRadius: 18,
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

      {/* 8. PROFILE & IDENTITY */}
      <section
        id="profile"
        style={{
          position: "relative",
          padding: "80px 20px 160px 20px",
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
            maxWidth: 520,
            padding: 36,
            borderRadius: 30,
            background: "rgba(18, 20, 24, 0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
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
              fontSize: 24,
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

      {/* Floating Liquid Navigation Dock */}
      <LiquidDock />
    </main>
  );
}
