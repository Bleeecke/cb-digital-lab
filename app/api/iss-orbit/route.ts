import { NextResponse } from "next/server";
import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } from "satellite.js";

const TLE1 = "1 25544U 98067A   26146.52728009  .00012689  00000+0  23271-3 0  9990";
const TLE2 = "2 25544  51.6371  76.2583 0003682 154.5561 299.8758 15.50035680454684";
const satrec = twoline2satrec(TLE1, TLE2);

type Coord = [number, number];

function wrapLon(lon: number): number { let value = lon; while (value > 180) value -= 360; while (value < -180) value += 360; return value; }

function predictGroundTrack(start: Date, minutes: number, stepSeconds: number): Coord[] {
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

export async function GET() {
  const now = new Date();
  const pastStart = new Date(now.getTime() - 92 * 60 * 1000);
  return NextResponse.json({
    past: predictGroundTrack(pastStart, 92, 30),
    forecast: predictGroundTrack(now, 46, 30),
    generatedAt: now.toISOString(),
  });
}
