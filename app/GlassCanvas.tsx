"use client";

import { useLiquidEngine } from "../hooks/useLiquidEngine";

/* ============================================================
 * GlassCanvas — full-viewport canvas driven by the Wasm engine.
 *
 * Client-only (useEffect + refs). Registers a default lens that
 * covers the full viewport so the liquid glass effect is always
 * visible behind the landing content.
 * ============================================================ */
export function GlassCanvas() {
  const { ready, error } = useLiquidEngine("glass-canvas");

  return (
    <canvas
      id="glass-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
