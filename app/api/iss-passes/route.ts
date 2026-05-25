import { NextResponse } from "next/server";
import { eciToEcf, ecfToLookAngles, gstime, propagate, twoline2satrec } from "satellite.js";

type PassEvent = { riseTime: string; maxTime: string; setTime: string; maxElevationDeg: number; score: number; stars: number };
const TLE1 = "1 25544U 98067A   26146.52728009  .00012689  00000+0  23271-3 0  9990";
const TLE2 = "2 25544  51.6371  76.2583 0003682 154.5561 299.8758 15.50035680454684";
const satrec = twoline2satrec(TLE1, TLE2);
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function dayOfYear(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86400000);
}

function sunAltitudeDeg(lat: number, lon: number, date: Date) {
  const n = dayOfYear(date);
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const gamma = (2 * Math.PI / 365) * (n - 1 + (hour - 12) / 24);
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const timeOffset = eqtime + 4 * lon;
  const tst = (hour * 60 + timeOffset + 1440) % 1440;
  const ha = rad(tst / 4 - 180);
  const latR = rad(lat);
  const alt = Math.asin(Math.sin(latR) * Math.sin(decl) + Math.cos(latR) * Math.cos(decl) * Math.cos(ha));
  return deg(alt);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const days = Math.max(1, Math.min(7, Number(searchParams.get("days") ?? "3")));
  if (Number.isNaN(lat) || Number.isNaN(lon)) return NextResponse.json({ error: "lat/lon required" }, { status: 400 });

  const observerGd = { latitude: rad(lat), longitude: rad(lon), height: 0.2 };
  const passes: PassEvent[] = [];
  const start = Date.now();
  const end = start + days * 24 * 60 * 60 * 1000;
  const stepMs = 20000;
  const minEl = rad(10);

  let inPass = false;
  let rise: Date | null = null;
  let maxT: Date | null = null;
  let maxEl = -Infinity;

  for (let t = start; t <= end; t += stepMs) {
    const d = new Date(t);
    const pv = propagate(satrec, d);
    if (!pv || !pv.position) continue;
    const gmst = gstime(d);
    const ecf = eciToEcf(pv.position, gmst);
    const look = ecfToLookAngles(observerGd, ecf);
    const el = look.elevation;

    if (!inPass && el >= minEl) { inPass = true; rise = d; maxT = d; maxEl = el; }
    if (inPass) {
      if (el > maxEl) { maxEl = el; maxT = d; }
      if (el < minEl) {
        const set = d;
        if (rise && maxT) {
          const maxElevationDeg = Number((deg(maxEl)).toFixed(1));
          const sunAlt = sunAltitudeDeg(lat, lon, maxT);
          const heightScore = Math.min(1, Math.max(0, (maxElevationDeg - 10) / 70));
          const darkScore = Math.min(1, Math.max(0, (-sunAlt - 3) / 15));
          const score = Number((heightScore * 0.65 + darkScore * 0.35).toFixed(2));
          const stars = Math.max(1, Math.min(5, Math.round(score * 5)));
          passes.push({ riseTime: rise.toISOString(), maxTime: maxT.toISOString(), setTime: set.toISOString(), maxElevationDeg, score, stars });
        }
        inPass = false; rise = null; maxT = null; maxEl = -Infinity;
        if (passes.length >= 8) break;
      }
    }
  }

  return NextResponse.json({ passes, observer: { lat, lon }, days });
}
