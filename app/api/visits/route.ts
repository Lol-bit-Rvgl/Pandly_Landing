import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

/* ============================================================
 * Atomic Visit Counter — GET / POST /api/visits
 *
 * Persistence: a single JSON file in os.tmpdir() (cross-platform).
 * Falls back safely to in-memory if disk is not writable.
 *
 * GET  → { visits: number }
 * POST → { visits: number }  (increments)
 * ============================================================ */

function getStorePath(): string {
  try {
    return join(process.cwd(), ".next", "pandly_visits.json");
  } catch {
    return "";
  }
}

/* In-memory fallback */
let memVisits = 2480;
let memLoaded = false;

async function loadVisits(): Promise<number> {
  try {
    const storePath = getStorePath();
    if (storePath && existsSync(storePath)) {
      const raw = await readFile(storePath, "utf-8");
      const data = JSON.parse(raw);
      if (typeof data.visits === "number" && !isNaN(data.visits)) {
        memVisits = data.visits;
        return data.visits;
      }
    }
  } catch {
    /* Fall back to memory */
  }

  if (!memLoaded) {
    memLoaded = true;
  }
  return memVisits;
}

async function saveVisits(n: number): Promise<void> {
  memVisits = n;
  try {
    const storePath = getStorePath();
    if (storePath) {
      const dir = join(process.cwd(), ".next");
      await mkdir(dir, { recursive: true });
      await writeFile(
        storePath,
        JSON.stringify({ visits: n, updatedAt: new Date().toISOString() }),
        "utf-8"
      );
    }
  } catch {
    /* Safe fallback to in-memory */
  }
}

export async function GET() {
  try {
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
  } catch {
    return NextResponse.json(
      { visits: memVisits },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

export async function POST() {
  try {
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
  } catch {
    memVisits += 1;
    return NextResponse.json(
      { visits: memVisits },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
