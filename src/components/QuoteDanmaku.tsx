const rows: { speed: number; reverse?: boolean; items: string[] }[] = [
  {
    speed: 58,
    items: [
      "“Don't fix it. I understood you perfectly.”",
      "“Take your time — I'm not going anywhere.”",
      "“You just used a phrasal verb. Did you notice?”",
      "“Say it again, slower, and own it.”",
    ],
  },
  {
    speed: 74,
    reverse: true,
    items: [
      "“What do people do all that rainy season?”",
      "“In my town the fog comes before the tide.”",
      "“Tell me about the street you grew up on.”",
      "“Your accent is part of the meaning.”",
    ],
  },
  {
    speed: 66,
    items: [
      "“Let me back up a bit.”",
      "“I think what I mean is…”",
      "“Sorry — how do you say this in English?”",
      "“Okay. I'll try without the notes.”",
    ],
  },
  {
    speed: 88,
    reverse: true,
    items: [
      "“Same time next Tuesday?”",
      "“You sounded different today. Lighter.”",
      "“That was a whole conversation. No script.”",
      "“See you across the time zones.”",
    ],
  },
];

export function QuoteDanmaku() {
  return (
    <div aria-hidden className="relative -mx-6 space-y-6 overflow-hidden py-4 md:-mx-12">
      {rows.map((row, i) => (
        <div key={i} className="overflow-hidden">
          <div
            className="danmaku-track font-serif-cn text-base italic text-foreground/55 md:text-xl"
            style={{
              animationDuration: `${row.speed}s`,
              animationDirection: row.reverse ? "reverse" : "normal",
            }}
          >
            {[...row.items, ...row.items].map((quote, j) => (
              <span key={j} className="whitespace-nowrap">
                {quote}
              </span>
            ))}
          </div>
        </div>
      ))}
      <p className="sr-only">对话原文摘录集合</p>
    </div>
  );
}
