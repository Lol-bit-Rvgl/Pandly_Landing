"use client";

import React, { useState, useEffect } from "react";
import { useLiquidTelemetry } from "../hooks/useLiquidEngine";
import { Activity, ChevronDown, ChevronUp, Cpu, Eye, Gauge, Sparkles, Terminal } from "lucide-react";

export function PhysicsInspector() {
  const telemetry = useLiquidTelemetry();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"math" | "metrics">("math");

  return (
    <aside
      aria-label="Physics & Shader Live Inspector"
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
      {/* Collapsed Pill Button */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(18, 20, 24, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(230, 83, 60, 0.2)",
            color: "#FFFFFF",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(30, 33, 39, 0.95)";
            e.currentTarget.style.borderColor = "rgba(255, 106, 77, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(18, 20, 24, 0.82)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: telemetry.fps >= 55 ? "#06D6A0" : "#FFD166",
              boxShadow: `0 0 8px ${telemetry.fps >= 55 ? "#06D6A0" : "#FFD166"}`,
            }}
          />
          <span style={{ color: "#FF6A4D", fontWeight: 600 }}>{telemetry.fps} FPS</span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>|</span>
          <span>{telemetry.frameTimeMs}ms</span>
          <ChevronDown size={14} style={{ opacity: 0.6, marginLeft: 2 }} />
        </button>
      ) : (
        /* Expanded Apple-Style Inspector Panel */
        <div
          style={{
            width: 320,
            borderRadius: 24,
            background: "rgba(15, 17, 21, 0.92)",
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
          {/* Inspector Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={16} color="#FF6A4D" />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>
                Liquid Physics Inspector
              </span>
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

          {/* Performance Status Badge */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 14,
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
              <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.45)", marginBottom: 2 }}>
                FRAME RATE
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#06D6A0" }}>
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
              <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.45)", marginBottom: 2 }}>
                FRAME TIME
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FF6A4D" }}>
                {telemetry.frameTimeMs} <span style={{ fontSize: 10, fontWeight: 400 }}>ms</span>
              </div>
            </div>
          </div>

          {/* Core Shader Optical Formulas */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
            {/* Normal Vector */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", marginBottom: 2 }}>
                <span>N = normal(SDF(p))</span>
                <span style={{ color: "#FF6A4D" }}>3D Vector</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FFFFFF" }}>
                [{telemetry.normal[0]}, {telemetry.normal[1]}, {telemetry.normal[2]}]
              </div>
            </div>

            {/* Refraction displacement */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", marginBottom: 2 }}>
                <span>R = kr·Nxy·f(edge)·f(int)</span>
                <span style={{ color: "#FF6A4D" }}>Disp (px)</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FFFFFF" }}>
                ΔX: {telemetry.refraction[0]} | ΔY: {telemetry.refraction[1]}
              </div>
            </div>

            {/* Fresnel Factor */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#A9B0BC", marginBottom: 2 }}>
                <span>F = F0 + (1-F0)(1-N·V)⁵</span>
                <span style={{ color: "#FF6A4D" }}>Fresnel</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FFFFFF" }}>
                {telemetry.fresnel} (F₀ = 0.040)
              </div>
            </div>

            {/* Glass Colors Output Swatches */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div style={{ color: "#A9B0BC", marginBottom: 4 }}>Color Composition</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
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
                      width: 12,
                      height: 12,
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

          {/* Footer Info */}
          <div
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <span>Lenses: {telemetry.activeLensesCount}</span>
            <span>V_ptr: [{telemetry.pointerVelocity[0]}, {telemetry.pointerVelocity[1]}]</span>
          </div>
        </div>
      )}
    </aside>
  );
}
