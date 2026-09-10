"use client";

import React from "react";
import { Mail, Globe, Shield, MessageCircle } from "lucide-react";

/**
 * Discord Icon Component (Vector)
 */
function DiscordMiniIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/**
 * X (Twitter) Icon Component (Vector)
 */
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Footer
 * Institutional footer for Pandly Inc. inspired by Kyubi.
 * Features:
 *  - Dark modular 3-column architecture
 *  - Column 1: Panda Isotype + Brand vision
 *  - Column 2: Legal links (Privacy, Terms, Guidelines, Safety)
 *  - Column 3: Contact & Community channels (Email, Discord, X)
 *  - Bottom closing bar: Copyright + live operational status pill
 */
export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        background: "#050608",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "clamp(60px, 8vh, 88px) 24px 36px 24px",
      }}
    >
      {/* Top Modular Grid */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "clamp(36px, 5vw, 64px)",
          marginBottom: 56,
        }}
      >
        {/* Column 1: Marca & Visión */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <img
              src="/assets/images/Panda_Head.png"
              alt="Pandly Panda"
              style={{
                width: 38,
                height: 38,
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(230, 83, 60, 0.5))",
              }}
            />
            <div>
              <span
                style={{
                  fontFamily: "var(--font-dyna-puff)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                Pandly
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-lilita-one)",
                  fontSize: 12,
                  color: "#FF6A4D",
                  letterSpacing: "0.02em",
                }}
              >
                Tu espacio social 2.5D
              </span>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.6,
              maxWidth: 320,
              margin: "8px 0 0 0",
            }}
          >
            Salas de cine sincronizadas, audio espacial y mundos compartidos donde tu identidad cobra vida.
          </p>
        </div>

        {/* Column 2: Legal & Normas */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 14,
              fontWeight: 600,
              color: "#FFFFFF",
              margin: "0 0 18px 0",
              letterSpacing: "0.02em",
            }}
          >
            Legal
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              { label: "Política de Privacidad", href: "#" },
              { label: "Términos y Condiciones", href: "#" },
              { label: "Normas de la Comunidad", href: "#" },
              { label: "Seguridad y Privacidad de Menores", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-lilita-one)",
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.65)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FF6A4D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contacto & Redes */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-dyna-puff)",
              fontSize: 14,
              fontWeight: 600,
              color: "#FFFFFF",
              margin: "0 0 18px 0",
              letterSpacing: "0.02em",
            }}
          >
            Contacto & Comunidad
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <a
              href="mailto:contact@pandly.app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-lilita-one)",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.75)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FF6A4D";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
              }}
            >
              <Mail size={16} color="#FF6A4D" />
              <span>contact@pandly.app</span>
            </a>

            {/* Social Icons Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              {[
                { label: "Discord", href: "https://discord.gg/G32qsbs249", icon: DiscordMiniIcon },
                { label: "X (Twitter)", href: "https://x.com/pandlyapp", icon: XIcon },
                { label: "Salas en Vivo", href: "#chats", icon: MessageCircle },
              ].map((item) => {
                const IconComponent = item.icon;
                const isExternal = item.href.startsWith("http");
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 106, 77, 0.2)";
                      e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.5)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Closing Bar */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-lilita-one)",
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          © 2026 Pandly Inc. Todos los derechos reservados.
        </span>

        {/* Operational Status Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(18, 20, 24, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#06D6A0",
              boxShadow: "0 0 8px #06D6A0",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-lilita-one)",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            Todos los sistemas operativos
          </span>
        </div>
      </div>
    </footer>
  );
}
