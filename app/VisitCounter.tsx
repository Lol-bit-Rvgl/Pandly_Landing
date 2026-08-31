"use client";

import { useEffect, useState, useCallback } from "react";

/* ============================================================
 * VisitCounter — OLED/Glass HUD component
 *
 * Fetches visit count on mount, increments on first view.
 * Renders a minimal pill with frosted-glass aesthetic.
 * ============================================================ */
export function VisitCounter() {
  const [visits, setVisits] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits", { cache: "no-store" });
      const data = await res.json();
      setVisits(data.visits);
    } catch {
      setVisits(0);
    }
  }, []);

  const incrementVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits", { method: "POST" });
      const data = await res.json();
      setVisits(data.visits);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchVisits();
    incrementVisits();
  }, [fetchVisits, incrementVisits]);

  if (visits === null) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 999,
        background: flash
          ? "rgba(255, 255, 255, 0.18)"
          : "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: flash
          ? "0 0 20px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        fontFamily: "var(--font-dyna-puff), system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.85)",
        letterSpacing: "0.02em",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        userSelect: "none",
        cursor: "default",
      }}
    >
      {/* Pulsing dot */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: flash ? "#4ade80" : "rgba(255, 255, 255, 0.4)",
          boxShadow: flash ? "0 0 8px #4ade80" : "none",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      />

      <span style={{ opacity: 0.5 }}>visits</span>

      <span
        style={{
          fontVariantNumeric: "tabular-nums",
          fontWeight: 700,
          color: "#fff",
          minWidth: 24,
          textAlign: "right",
        }}
      >
        {visits.toLocaleString()}
      </span>
    </div>
  );
}
