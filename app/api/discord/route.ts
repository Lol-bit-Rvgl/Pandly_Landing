import { NextResponse } from "next/server";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

const DISCORD_INVITE_CODE = "G32qsbs249";
const DISCORD_API_ENDPOINT = `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`;

const FALLBACK_DATA = {
  totalMembers: 1400,
  onlineMembers: 147,
};

export async function GET() {
  try {
    const res = await fetch(DISCORD_API_ENDPOINT, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[pandly/discord-api] Discord API returned ${res.status}, using fallback`);
      return NextResponse.json(FALLBACK_DATA, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    const data = await res.json();
    const totalMembers =
      typeof data.approximate_member_count === "number"
        ? data.approximate_member_count
        : typeof data.profile?.member_count === "number"
        ? data.profile.member_count
        : FALLBACK_DATA.totalMembers;

    const onlineMembers =
      typeof data.approximate_presence_count === "number"
        ? data.approximate_presence_count
        : typeof data.profile?.online_count === "number"
        ? data.profile.online_count
        : FALLBACK_DATA.onlineMembers;

    return NextResponse.json(
      {
        totalMembers,
        onlineMembers,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.warn("[pandly/discord-api] Fetch failed, serving fallback:", error);
    return NextResponse.json(FALLBACK_DATA, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  }
}
