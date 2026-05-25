import { NextResponse } from "next/server";
import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } from "satellite.js";

const FALLBACK_TLE1 = "1 25544U 98067A   26146.52728009  .00012689  00000+0  23271-3 0  9990";
const FALLBACK_TLE2 = "2 25544  51.6371  76.2583 0003682 154.5561 299.8758 15.50035680454684";
const TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE";
const TLE_TTL_MS = 60 * 60 * 1000;

type Coord = [number, number];
type TleCache = { line1: string; line2: string; fetchedAt: number; source: "fresh_tle" | "fallback_tle" };

let cachedTle: TleCache | null = null;

function wrapLon(lon: number): number {
  let value = lon;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function predictGroundTrack(start: Date, minutes: number, stepSeconds: number, tle1: string, tle2: string): Coord[] {
  const satrec = twoline2satrec(tle1, tle2);
  const out: Coord[] = [];
  for (let t = 0; t <= minutes * 60; t += stepSeconds) {
    const d = new Date(start.getTime() + t * 1000);
    const pv = propagate(satrec, d);
    if (!pv || !pv.position) continue;
    const gmst = gstime(d);
    const gd = eciToGeodetic(pv.position, gmst);
    out.push([wrapLon(degreesLong(gd.longitude)), degreesLat(gd.latitude)]);
  }
  return out;
}

function computeNowState(tle1: string, tle2: string, at: Date) {
  const satrec = twoline2satrec(tle1, tle2);
  const pv = propagate(satrec, at);
  if (!pv || !pv.position || !pv.velocity) return null;
  const gmst = gstime(at);
  const gd = eciToGeodetic(pv.position, gmst);
  const altitudeKm = Number(gd.height.toFixed(1));
  const speedKmS = Math.sqrt(
    pv.velocity.x * pv.velocity.x + pv.velocity.y * pv.velocity.y + pv.velocity.z * pv.velocity.z,
  );
  const velocityKmh = Number((speedKmS * 3600).toFixed(0));
  return { altitudeKm, velocityKmh };
}

function parseTle(text: string): { line1: string; line2: string } | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const line1 = lines.find((l) => l.startsWith("1 "));
  const line2 = lines.find((l) => l.startsWith("2 "));
  if (!line1 || !line2) return null;
  return { line1, line2 };
}

async function getIssTle(): Promise<TleCache> {
  const now = Date.now();
  if (cachedTle && now - cachedTle.fetchedAt < TLE_TTL_MS) return cachedTle;

  try {
    const response = await fetch(TLE_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`TLE fetch failed: ${response.status}`);
    const text = await response.text();
    const parsed = parseTle(text);
    if (!parsed) throw new Error("TLE parse failed");
    cachedTle = { ...parsed, fetchedAt: now, source: "fresh_tle" };
    return cachedTle;
  } catch {
    if (cachedTle) return cachedTle;
    return { line1: FALLBACK_TLE1, line2: FALLBACK_TLE2, fetchedAt: now, source: "fallback_tle" };
  }
}

export async function GET() {
  const tle = await getIssTle();

  if (tle.source !== "fresh_tle") {
    return NextResponse.json(
      {
        error: "orbit_data_unavailable",
        message: "Fresh orbit data unavailable",
        source: tle.source,
        generatedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  const now = new Date();
  const pastStart = new Date(now.getTime() - 92 * 60 * 1000);
  const past = predictGroundTrack(pastStart, 92, 30, tle.line1, tle.line2);
  const forecast = predictGroundTrack(now, 46, 30, tle.line1, tle.line2);
  const nowState = computeNowState(tle.line1, tle.line2, now);

  return NextResponse.json({
    past,
    forecast,
    nowState,
    generatedAt: now.toISOString(),
    tleFetchedAt: new Date(tle.fetchedAt).toISOString(),
    source: tle.source,
  });
}
