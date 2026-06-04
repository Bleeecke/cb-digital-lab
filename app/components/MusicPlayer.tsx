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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentIndex];
  const currentSrc = useMemo(
    () => `/Songs/${encodeURIComponent(currentSong.fileName)}`,
    [currentSong.fileName],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentIndex]);

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
    if (!audio) return;

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

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 backdrop-blur-md md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
              Band Songs
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              The Static Frames Audio Vault
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
              Play unreleased songs directly on the site and let visitors download
              them as MP3 files.
            </p>
          </div>

          <a
            href={currentSrc}
            download
            className="inline-flex rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
          >
            Download Current Track
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                Now Playing
              </p>
              <h4 className="mt-2 text-xl font-semibold text-zinc-100 md:text-2xl">
                {currentSong.title}
              </h4>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                {currentSong.description}
              </p>
            </div>

            <button
              onClick={togglePlayback}
              className="inline-flex min-w-[132px] items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          <div className="mt-6">
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
            <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-zinc-500">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={currentSrc} preload="metadata" />
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/55 p-5 backdrop-blur-md md:p-6">
        <p className="text-xs uppercase tracking-[0.34em] text-zinc-500 md:text-sm">
          Track List
        </p>
        <div className="mt-5 grid gap-3">
          {songs.map((song, index) => {
            const active = index === currentIndex;
            const songSrc = `/Songs/${encodeURIComponent(song.fileName)}`;

            return (
              <div
                key={song.fileName}
                className={`rounded-2xl border p-4 transition-colors ${
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-zinc-800 bg-black/25 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() => jumpToSong(index)}
                    className="text-left"
                  >
                    <h4 className="text-base font-semibold text-zinc-100 md:text-lg">
                      {song.title}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {song.description}
                    </p>
                  </button>
                  <a
                    href={songSrc}
                    download
                    className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-900"
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
  );
}
