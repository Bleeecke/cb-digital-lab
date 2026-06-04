"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type Song = {
  title: string;
  fileName: string;
  description: string;
};

type MusicPlayerProps = {
  songs: Song[];
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export default function MusicPlayer({ songs }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const barsFrameRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [bass, setBass] = useState(0);
  const [mid, setMid] = useState(0);
  const [treble, setTreble] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [bars, setBars] = useState<number[]>(Array.from({ length: 18 }, () => 8));

  const currentSong = songs[currentIndex];
  const currentSrc = useMemo(
    () => `/Songs/${encodeURIComponent(currentSong.fileName)}`,
    [currentSong.fileName],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const AudioContextCtor = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current && AudioContextCtor) {
      const context = new AudioContextCtor();
      const source = context.createMediaElementSource(audio);
      const low = context.createBiquadFilter();
      const midFilter = context.createBiquadFilter();
      const high = context.createBiquadFilter();
      const analyser = context.createAnalyser();

      low.type = "lowshelf";
      low.frequency.value = 140;
      midFilter.type = "peaking";
      midFilter.frequency.value = 1200;
      midFilter.Q.value = 0.8;
      high.type = "highshelf";
      high.frequency.value = 4500;
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(low);
      low.connect(midFilter);
      midFilter.connect(high);
      high.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      sourceNodeRef.current = source;
      lowFilterRef.current = low;
      midFilterRef.current = midFilter;
      highFilterRef.current = high;
      analyserRef.current = analyser;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (lowFilterRef.current) lowFilterRef.current.gain.value = bass;
  }, [bass]);

  useEffect(() => {
    if (midFilterRef.current) midFilterRef.current.gain.value = mid;
  }, [mid]);

  useEffect(() => {
    if (highFilterRef.current) highFilterRef.current.gain.value = treble;
  }, [treble]);

  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser || !isPlaying) {
      if (barsFrameRef.current !== null) {
        cancelAnimationFrame(barsFrameRef.current);
        barsFrameRef.current = null;
      }
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bandCount = 18;
      const step = Math.max(1, Math.floor(data.length / bandCount));
      const nextBars = Array.from({ length: bandCount }, (_, index) => {
        const start = index * step;
        const end = Math.min(data.length, start + step);
        let sum = 0;
        for (let i = start; i < end; i += 1) sum += data[i];
        const avg = sum / Math.max(1, end - start);
        return Math.max(6, Math.min(100, Math.round((avg / 255) * 100)));
      });
      setBars(nextBars);
      barsFrameRef.current = window.requestAnimationFrame(tick);
    };

    barsFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (barsFrameRef.current !== null) {
        cancelAnimationFrame(barsFrameRef.current);
        barsFrameRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    const audioContext = audioContextRef.current;
    if (!audio) return;

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const jumpToSong = (index: number) => {
    setCurrentIndex(index);
  };

  const playPrevious = () => {
    setCurrentIndex((index) => (index - 1 + songs.length) % songs.length);
  };

  const playNext = () => {
    setCurrentIndex((index) => (index + 1) % songs.length);
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4 backdrop-blur-md md:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Band Songs
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100 md:text-2xl">
              The Static Frames Audio Vault
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Play unreleased songs directly in the browser. Details, downloads,
              and the full track list are available below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={playPrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
              aria-label="Previous track"
              type="button"
            >
              {"<"}
            </button>
            <button
              onClick={togglePlayback}
              className="inline-flex min-w-[110px] items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300"
              type="button"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={playNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
              aria-label="Next track"
              type="button"
            >
              {">"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-zinc-800 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">
              Now Playing
            </p>
            <h4 className="mt-2 text-lg font-semibold text-zinc-100 md:text-xl">
              {currentSong.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {currentSong.description}
            </p>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  const audio = audioRef.current;
                  if (!audio) return;
                  audio.currentTime = nextTime;
                  setProgress(nextTime);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-cyan-400"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Visualizer
              </p>
              <div className="mt-3 flex h-20 items-end gap-1 overflow-hidden rounded-2xl border border-zinc-800 bg-black/30 p-3">
                {bars.map((height, index) => (
                  <div
                    key={`${index}-${height}`}
                    className="flex-1 rounded-t-full bg-gradient-to-t from-cyan-500 via-cyan-300 to-white/90 transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Volume
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                Min
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  const audio = audioRef.current;
                  if (!audio) return;
                  audio.volume = nextVolume;
                  setVolume(nextVolume);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-cyan-400"
                aria-label="Volume"
              />
              <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                Max
              </span>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
                Equalizer
              </p>
              <div className="mt-4 grid gap-4">
                {[
                  {
                    label: "Bass",
                    value: bass,
                    setter: setBass,
                    min: -12,
                    max: 12,
                  },
                  {
                    label: "Mid",
                    value: mid,
                    setter: setMid,
                    min: -12,
                    max: 12,
                  },
                  {
                    label: "Treble",
                    value: treble,
                    setter: setTreble,
                    min: -12,
                    max: 12,
                  },
                ].map((band) => (
                  <label key={band.label} className="grid gap-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-zinc-500">
                      <span>{band.label}</span>
                      <span>{band.value > 0 ? `+${band.value}` : band.value} dB</span>
                    </div>
                    <input
                      type="range"
                      min={band.min}
                      max={band.max}
                      step={1}
                      value={band.value}
                      onChange={(event) => band.setter(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-cyan-400"
                      aria-label={`${band.label} equalizer`}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDetails((value) => !value)}
                className="rounded-full border border-zinc-700 bg-black/20 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                {showDetails ? "Hide details" : "Show details"}
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="rounded-2xl border border-zinc-800 bg-black/25 p-4">
            <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-500">
              Track List & Downloads
            </p>
            <div className="mt-3 max-h-80 overflow-y-auto pr-1">
              <div className="grid gap-2">
                {songs.map((song, index) => {
                  const active = index === currentIndex;
                  const songSrc = `/Songs/${encodeURIComponent(song.fileName)}`;

                  return (
                    <div
                      key={song.fileName}
                      className={`rounded-xl border p-3 transition-colors ${
                        active
                          ? "border-cyan-400/50 bg-cyan-400/10"
                          : "border-zinc-800 bg-black/20 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => jumpToSong(index)}
                          className="text-left"
                        >
                          <h4 className="text-sm font-semibold text-zinc-100 md:text-base">
                            {song.title}
                          </h4>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">
                            {song.description}
                          </p>
                        </button>
                        <a
                          href={songSrc}
                          download
                          className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src={currentSrc} preload="metadata" />
    </div>
  );
}
