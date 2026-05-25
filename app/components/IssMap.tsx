"use client";

import maplibregl, { GeoJSONSource, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";

type IssApiResponse = {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
};

type Coord = [number, number];
const ISS_API = "https://api.wheretheiss.at/v1/satellites/25544";

function wrapLon(lon: number): number {
  let v = lon;
  while (v > 180) v -= 360;
  while (v < -180) v += 360;
  return v;
}

function splitSegments(coords: Coord[]): Coord[][] {
  if (coords.length < 2) return coords.length ? [coords] : [];
  const segments: Coord[][] = [[coords[0]]];
  for (let i = 1; i < coords.length; i += 1) {
    const prev = coords[i - 1];
    const cur = coords[i];
    if (Math.abs(cur[0] - prev[0]) > 180) segments.push([cur]);
    else segments[segments.length - 1].push(cur);
  }
  return segments.filter((s) => s.length > 1);
}

function lineFeatures(coords: Coord[]) {
  return splitSegments(coords).map((segment) => ({
    type: "Feature" as const,
    geometry: { type: "LineString" as const, coordinates: segment },
    properties: {},
  }));
}

export default function IssMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const trailRef = useRef<Coord[]>([]);

  const [issData, setIssData] = useState<IssApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latInput, setLatInput] = useState("52.52");
  const [lonInput, setLonInput] = useState("13.40");
  const [forecastOpen, setForecastOpen] = useState(false);
  const [passes, setPasses] = useState<
    Array<{ riseTime: string; maxTime: string; setTime: string; maxElevationDeg: number; stars?: number }>
  >([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [8, 20],
      zoom: 1.6,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");

    map.on("load", () => {
      map.addSource("iss-trail", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addSource("iss-forecast", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

      map.addLayer({
        id: "iss-trail-line",
        type: "line",
        source: "iss-trail",
        paint: { "line-color": "#67e8f9", "line-width": 2.6, "line-opacity": 0.9 },
      });

      map.addLayer({
        id: "iss-forecast-line",
        type: "line",
        source: "iss-forecast",
        paint: { "line-color": "#22d3ee", "line-width": 1.7, "line-opacity": 0.58, "line-dasharray": [2, 3] },
      });

      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "9999px";
      el.style.background = "#22d3ee";
      el.style.border = "2px solid #ecfeff";
      el.style.boxShadow = "0 0 14px rgba(34,211,238,0.95)";
      markerRef.current = new maplibregl.Marker({ element: el }).setLngLat([0, 0]).addTo(map);
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const tick = async () => {
      try {
        const response = await fetch(ISS_API, { cache: "no-store" });
        if (!response.ok) throw new Error("ISS feed unavailable");
        const data = (await response.json()) as IssApiResponse;
        if (!mounted) return;

        setIssData(data);
        setError(null);

        const nowPoint: Coord = [wrapLon(data.longitude), data.latitude];
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        trailRef.current = [...trailRef.current, nowPoint].slice(-2200);
        const trailSource = map.getSource("iss-trail") as GeoJSONSource | undefined;
        trailSource?.setData({ type: "FeatureCollection", features: lineFeatures(trailRef.current) });

        markerRef.current?.setLngLat(nowPoint);

        try {
          const orbitResponse = await fetch("/api/iss-orbit", { cache: "no-store" });
          const orbitJson = (await orbitResponse.json()) as { forecast?: Coord[] };
          const forecastTrack = (orbitJson.forecast ?? []).map(([lon, lat]) => [wrapLon(lon), lat] as Coord);
          const forecastSource = map.getSource("iss-forecast") as GeoJSONSource | undefined;
          forecastSource?.setData({ type: "FeatureCollection", features: lineFeatures([nowPoint, ...forecastTrack]) });
        } catch {
          const forecastSource = map.getSource("iss-forecast") as GeoJSONSource | undefined;
          forecastSource?.setData({ type: "FeatureCollection", features: [] });
        }

        map.easeTo({ center: nowPoint as LngLatLike, duration: 1000, essential: true });
      } catch {
        if (mounted) setError("Telemetry stream unavailable");
      }
    };

    tick();
    const interval = window.setInterval(tick, 3000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Latitude", value: issData ? `${issData.latitude.toFixed(2)}°` : "Loading" },
      { label: "Longitude", value: issData ? `${issData.longitude.toFixed(2)}°` : "Loading" },
      { label: "Velocity", value: issData ? `${Math.round(issData.velocity).toLocaleString()} km/h` : "Loading" },
      { label: "Altitude", value: issData ? `${Math.round(issData.altitude)} km` : "Loading" },
    ],
    [issData],
  );

  const loadPasses = async () => {
    const lat = Number(latInput);
    const lon = Number(lonInput);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;
    const res = await fetch(`/api/iss-passes?lat=${lat}&lon=${lon}&days=3`, { cache: "no-store" });
    const json = (await res.json()) as {
      passes?: Array<{ riseTime: string; maxTime: string; setTime: string; maxElevationDeg: number; stars?: number }>;
    };
    setPasses(json.passes ?? []);
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadPasses();
    }, 300);
    return () => window.clearTimeout(t);
  }, [latInput, lonInput]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="overflow-hidden rounded-2xl border border-cyan-900/40 bg-zinc-950/80 p-3">
        <div ref={containerRef} className="h-[380px] w-full rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
            <p className="mt-3 text-lg font-medium text-zinc-100">{item.value}</p>
          </div>
        ))}
        {error && (
          <div className="sm:col-span-2 rounded-2xl border border-rose-900/60 bg-rose-950/20 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}
        <div className="sm:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <button
            onClick={() => setForecastOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">ISS Visibility Forecast</p>
            <span className="text-xs text-zinc-400">{forecastOpen ? "Hide" : "Show"}</span>
          </button>
          {forecastOpen && (
            <>
              <div className="mt-3 flex gap-2">
                <input
                  className="w-1/2 rounded bg-zinc-950 px-2 py-1 text-sm"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="Latitude"
                />
                <input
                  className="w-1/2 rounded bg-zinc-950 px-2 py-1 text-sm"
                  value={lonInput}
                  onChange={(e) => setLonInput(e.target.value)}
                  placeholder="Longitude"
                />
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {passes.map((p, i) => (
              <div key={`${p.riseTime}-${i}`} className="rounded border border-zinc-800 p-2">
                <span className="text-base font-semibold tracking-wide">
                  <span className="text-cyan-300 [text-shadow:0_0_10px_rgba(34,211,238,0.45)]">
                    {"★".repeat(p.stars ?? 3)}
                  </span>
                  <span className="text-slate-700">{"☆".repeat(5 - (p.stars ?? 3))}</span>
                </span>
                <span className="ml-2">• Rise {new Date(p.riseTime).toLocaleString()} | Max {p.maxElevationDeg}° | Set {new Date(p.setTime).toLocaleTimeString()}</span>
              </div>
                ))}
                {passes.length === 0 && (
                  <div className="rounded border border-zinc-800 p-2 text-zinc-400">
                    No visible ISS passes in the next 3 days for this location.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
