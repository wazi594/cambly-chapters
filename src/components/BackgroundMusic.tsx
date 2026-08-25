import { useRef, useState } from "react";

const STORAGE_KEY = "cambly-background-music-time";
const BACKGROUND_VOLUME = 0.7;

/**
 * CC0 recording from Musopen via Wikimedia Commons:
 * https://commons.wikimedia.org/wiki/File:Nocturne_Op._9_no._2_in_E_flat_major.mp3
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audible, setAudible] = useState(false);

  const restorePosition = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BACKGROUND_VOLUME;
    const saved = Number.parseFloat(sessionStorage.getItem(STORAGE_KEY) ?? "0");
    if (Number.isFinite(saved) && saved > 0 && saved < audio.duration) audio.currentTime = saved;
  };

  const rememberPosition = () => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.currentTime)) {
      sessionStorage.setItem(STORAGE_KEY, String(audio.currentTime));
    }
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BACKGROUND_VOLUME;
    const nextAudible = !audible;

    try {
      if (audio.paused) await audio.play();
      audio.muted = !nextAudible;
      setAudible(nextAudible);
    } catch {
      audio.muted = true;
      setAudible(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-pressed={audible}
        aria-label={audible ? "将背景音乐静音" : "开启背景音乐"}
        onClick={toggleAudio}
        className="group fixed bottom-20 left-5 z-40 flex h-11 items-center gap-3 rounded-full border border-foreground/20 bg-background/80 px-4 text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:bottom-6 md:left-6"
      >
        <span aria-hidden className="flex h-4 items-end gap-[2px]">
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              className={`w-[2px] bg-current transition-[height] duration-500 ${audible ? "music-bar h-4" : "h-1.5"}`}
              style={{ animationDelay: `${bar * 160}ms` }}
            />
          ))}
        </span>
        <span className="font-mono text-[0.58rem] tracking-[0.16em]">MUSIC</span>
      </button>
      <audio
        ref={audioRef}
        data-background-music="true"
        data-volume={BACKGROUND_VOLUME}
        src="/media/chopin-nocturne-op9-no2.mp3"
        autoPlay
        muted
        loop
        preload="metadata"
        onLoadedMetadata={restorePosition}
        onTimeUpdate={rememberPosition}
      />
    </>
  );
}
