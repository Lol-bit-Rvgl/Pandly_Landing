import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

/* ============================================================
 * Atomic Visit Counter — GET / POST /api/visits
 *
 * Persistence: a single JSON file in /tmp (container-safe).
 * Falls back to in-memory if /tmp is read-only.
 *
 * GET  → { visits: number }
 * POST → { visits: number }  (increments)
 * ============================================================ */

const STORE_PATH = join("/tmp", "pandly_visits.json");

/* In-memory fallback when /tmp is not writable */
let memVisits = 0;
let memLoaded = false;

async function loadVisits(): Promise<number> {
  try {
    if (existsSync(STORE_PATH)) {
      const raw = await readFile(STORE_PATH, "utf-8");
      const data = JSON.parse(raw);
      return typeof data.visits === "number" ? data.visits : 0;
    }
  } catch {
    /* /tmp not writable — fall back to memory */
  }

  if (!memLoaded) {
    memLoaded = true;
  }
  return memVisits;
}

async function saveVisits(n: number): Promise<void> {
  try {
    await mkdir("/tmp", { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify({ visits: n, updatedAt: new Date().toISOString() }), "utf-8");
  } catch {
    memVisits = n;
  }
}

export async function GET() {
  const visits = await loadVisits();
  return NextResponse.json(
    { visits },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "CDN-Cache-Control": "no-store",
      },
    }
  );
}

export async function POST() {
  const current = await loadVisits();
  const next = current + 1;
  await saveVisits(next);
  return NextResponse.json(
    { visits: next },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
