const rows: { speed: number; reverse?: boolean; items: string[] }[] = [
  {
    speed: 82,
    items: [
      "I am loved because I love.",
      "Live well, see the world clearly.",
      "We are same human being.",
      "We are connected.",
      "It's a new script.",
      "A new stage for me.",
    ],
  },
  {
    speed: 96,
    reverse: true,
    items: [
      "I was a lawyer.",
      "But I am going to Australia.",
      "From barrister to barista.",
      "I worked five years as a lawyer.",
      "I suspended my job.",
      "I changed everything.",
    ],
  },
  {
    speed: 88,
    items: [
      "No one is coming.",
      "You must keep going.",
      "I'm not a very confident person.",
      "Have faith in yourself.",
      "Face yourself.",
      "Both are right.",
    ],
  },
  {
    speed: 102,
    reverse: true,
    items: [
      "You are the boss of your life.",
      "Spread your wings and fly.",
      "That's a gift.",
      "In your heart, you're saying Melbourne.",
      "You have that option.",
      "I admire you, Lou.",
    ],
  },
  {
    speed: 118,
    items: [
      "Don't give up easily.",
      "Give it a really good go.",
      "Yes, I will. I promise you.",
      "Forget everything. Forget my career.",
      "I love technology more than humans.",
      "my name is Lawrence Lawrence",
      "I chat with the barista while waiting.",
    ],
  },
];

export function QuoteDanmaku() {
  return (
    <div aria-hidden className="relative mx-0 space-y-6 overflow-hidden py-4">
      {rows.map((row, i) => (
        <div key={i} data-quote-track="true" className="overflow-hidden">
          <div
            className="danmaku-track font-serif-cn text-base italic text-foreground/55 md:text-xl"
            style={{
              animationDuration: `${row.speed}s`,
              animationDirection: row.reverse ? "reverse" : "normal",
            }}
          >
            {[...row.items, ...row.items].map((quote, j) => (
              <span key={j} className="whitespace-nowrap">
                “{quote}”
              </span>
            ))}
          </div>
        </div>
      ))}
      <p className="sr-only">对话原文摘录集合</p>
    </div>
  );
}
