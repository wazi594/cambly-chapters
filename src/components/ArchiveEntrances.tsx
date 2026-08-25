import { Link } from "@tanstack/react-router";
import { StoryCardDeck } from "@/components/StoryCardDeck";

export function StoriesEntrance() {
  return (
    <div className="max-w-3xl">
      <Link
        to="/stories"
        aria-label="进入回忆"
        className="archive-story-link group flex items-end justify-between gap-8 border-y border-foreground/35 py-6 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-primary"
      >
        <span className="font-display text-3xl text-foreground transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
          进入回忆
        </span>
        <span
          aria-hidden
          className="font-display text-4xl text-primary transition-transform duration-500 group-hover:translate-x-2"
        >
          →
        </span>
      </Link>
      <StoryCardDeck />
    </div>
  );
}

const bars = [32, 46, 41, 60, 56, 69, 88];

export function TrajectoryCollage() {
  return (
    <Link
      to="/trajectory"
      aria-label="打开八十六节课的轨迹"
      className="trajectory-collage group relative block h-full w-full overflow-hidden bg-[#eeece4] text-[#202b25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
    >
      <div aria-hidden className="trajectory-grid absolute inset-[9%_8%_12%_12%]" />
      <div
        aria-hidden
        className="trajectory-sheet trajectory-sheet-data absolute left-[11%] top-[12%] w-[48%] border border-[#202b25]/20 bg-[#1f2b27] p-4 text-[#f4f1e8] shadow-xl"
      >
        <p className="font-mono text-[0.55rem] tracking-[0.2em] text-white/55">
          CAMBLY / 2024.12—2025.06
        </p>
        <p className="mt-5 font-display text-5xl leading-none">86</p>
        <p className="mt-1 font-mono text-[0.58rem] tracking-[0.16em] text-white/65">
          CONVERSATIONS
        </p>
      </div>
      <div
        aria-hidden
        className="trajectory-sheet trajectory-sheet-blue absolute right-[7%] top-[20%] h-[30%] w-[53%] overflow-hidden bg-[#2c4a6e] p-4 text-white shadow-xl"
      >
        <div className="space-y-1 font-mono text-[0.48rem] leading-tight text-white/70">
          {Array.from({ length: 9 }).map((_, index) => (
            <p key={index}>LESSON_{String(index + 1).padStart(2, "0")} · WORDS · VOICE · MEMORY</p>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="trajectory-sheet trajectory-sheet-chart absolute bottom-[14%] left-[18%] h-[37%] w-[58%] p-4"
      >
        <div className="flex h-[72%] items-end gap-[7%] border-b border-l border-[#202b25]/25 px-3">
          {bars.map((height, index) => (
            <span key={index} className="w-3 bg-[#a9761e]/75" style={{ height: `${height}%` }} />
          ))}
        </div>
        <p className="mt-3 font-mono text-[0.5rem] tracking-[0.12em] text-[#202b25]/55">
          WORDS SPOKEN / MONTH
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#eeece4] via-[#eeece4]/95 to-transparent px-6 pb-6 pt-16 md:px-8">
        <span>
          <span className="block font-mono text-[0.58rem] tracking-[0.2em] text-[#202b25]/55">
            OPEN THE DATA ARCHIVE
          </span>
          <span className="mt-2 block font-display text-3xl md:text-4xl">八十六节课的轨迹</span>
        </span>
        <span
          aria-hidden
          className="font-display text-4xl text-[#2c4a6e] transition-transform duration-500 group-hover:translate-x-2"
        >
          ↗
        </span>
      </div>
    </Link>
  );
}

const voiceArchives = [
  {
    to: "/repeated-words" as const,
    eyebrow: "WORDS RETURNING",
    title: "反复说的话",
    description: "把一次次重复的句子按时间排开，看见它们如何改变。",
  },
  {
    to: "/family-traces" as const,
    eyebrow: "THE FAMILY THREAD",
    title: "家人的痕迹",
    description: "那些藏在课堂记录里、始终没有消失的暗线。",
  },
];

export function VoiceArchiveEntrances() {
  return (
    <div className="mt-14 grid border-y border-foreground/30 md:grid-cols-2 md:divide-x md:divide-foreground/20">
      {voiceArchives.map((entry, index) => (
        <Link
          key={entry.to}
          to={entry.to}
          className="voice-archive-link group relative min-h-56 overflow-hidden px-6 py-8 transition-colors hover:bg-background/35 focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary md:px-9"
        >
          <span
            aria-hidden
            className="absolute right-5 top-4 font-display text-6xl text-primary/10 transition-all duration-700 group-hover:text-primary/25"
          >
            0{index + 1}
          </span>
          <span className="relative block font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground">
            {entry.eyebrow}
          </span>
          <span className="relative mt-10 block font-display text-4xl text-foreground transition-transform duration-500 group-hover:-translate-y-1 md:text-5xl">
            {entry.title}
          </span>
          <span className="relative mt-5 block max-w-sm text-sm leading-relaxed text-foreground/60">
            {entry.description}
          </span>
          <span
            aria-hidden
            className="relative mt-8 block text-xl text-primary transition-transform duration-500 group-hover:translate-x-2"
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
