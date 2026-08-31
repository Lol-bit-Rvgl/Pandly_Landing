"use client";

import React, { useState } from "react";
import { useLiquidTelemetry } from "../hooks/useLiquidEngine";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

/**
 * PhysicsInspector
 * Collapsible real-time telemetry HUD displaying engine vital metrics:
 * framerate, frame delta, surface normal N, refraction offset R, Fresnel factor F,
 * and adaptive color compositing.
 */
export function PhysicsInspector() {
  const telemetry = useLiquidTelemetry();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Pandly Engine Vitals"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 100,
        fontFamily: "var(--font-dyna-puff), ui-monospace, SFMono-Regular, monospace",
        color: "#FFFFFF",
        userSelect: "none",
      }}
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Abrir telemetría técnica del motor"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(18, 20, 24, 0.7)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
            color: "#A9B0BC",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(30, 33, 39, 0.9)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(18, 20, 24, 0.7)";
            e.currentTarget.style.color = "#A9B0BC";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: telemetry.fps >= 55 ? "#06D6A0" : "#FFD166",
              boxShadow: `0 0 6px ${telemetry.fps >= 55 ? "#06D6A0" : "#FFD166"}`,
            }}
          />
          <span>Engine Vitals</span>
          <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
          <span style={{ color: "#FF6A4D" }}>{telemetry.fps} FPS</span>
          <ChevronDown size={13} style={{ opacity: 0.6 }} />
        </button>
      ) : (
        <div
          style={{
            width: 320,
            borderRadius: 24,
            background: "rgba(15, 17, 21, 0.94)",
            backdropFilter: "blur(32px) saturate(190%)",
            WebkitBackdropFilter: "blur(32px) saturate(190%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: `
              0 24px 48px -12px rgba(0, 0, 0, 0.85),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 0 32px -4px rgba(230, 83, 60, 0.25)
            `,
            overflow: "hidden",
            padding: "16px 18px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={15} color="#FF6A4D" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFF" }}>
                  Pandly Engine Vitals
                </div>
                <div style={{ fontSize: 10, color: "#A9B0BC", fontFamily: "var(--font-lilita-one)" }}>
                  Telemetría C++/WASM en Tiempo Real
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A9B0BC",
                cursor: "pointer",
              }}
            >
              <ChevronUp size={14} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ fontSize: 9, color: "rgba(255, 255, 255, 0.45)", marginBottom: 2 }}>
                TASA DE CUADROS
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#06D6A0" }}>
                {telemetry.fps} <span style={{ fontSize: 10, fontWeight: 400 }}>FPS</span>
              </div>
            </div>

            <div
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ fontSize: 9, color: "rgba(255, 255, 255, 0.45)", marginBottom: 2 }}>
                TIEMPO DE CUADRO
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FF6A4D" }}>
                {telemetry.frameTimeMs} <span style={{ fontSize: 10, fontWeight: 400 }}>ms</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
            <div
              style={{
                padding: "7px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", fontSize: 10 }}>
                <span>N = normal(SDF(p))</span>
                <span style={{ color: "#FF6A4D" }}>Vector 3D</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#FFF", marginTop: 2 }}>
                [{telemetry.normal[0]}, {telemetry.normal[1]}, {telemetry.normal[2]}]
              </div>
            </div>

            <div
              style={{
                padding: "7px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", fontSize: 10 }}>
                <span>R = kr·Nxy·f(edge)</span>
                <span style={{ color: "#FF6A4D" }}>Refracción</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#FFF", marginTop: 2 }}>
                ΔX: {telemetry.refraction[0]} | ΔY: {telemetry.refraction[1]}
              </div>
            </div>

            <div
              style={{
                padding: "7px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", fontSize: 10 }}>
                <span>F = F₀ + (1-F₀)(1-N·V)⁵</span>
                <span style={{ color: "#FF6A4D" }}>Fresnel</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#FFF", marginTop: 2 }}>
                {telemetry.fresnel}
              </div>
            </div>

            <div
              style={{
                padding: "7px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ color: "#A9B0BC", fontSize: 10, marginBottom: 4 }}>Composición de Color de Lente</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      backgroundColor: telemetry.cGlass,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>C_glass</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      backgroundColor: telemetry.cFinal,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>C_final</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 9,
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <span>Lentes activas: {telemetry.activeLensesCount}</span>
            <span>V_cursor: [{telemetry.pointerVelocity[0]}, {telemetry.pointerVelocity[1]}]</span>
          </div>
        </div>
      )}
    </aside>
  );
}
