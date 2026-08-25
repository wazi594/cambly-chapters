import { useEffect, useRef } from "react";
import { loadGsapWithScrollTrigger } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/paint-store";

const marks = ["11月", "12月", "1月", "2月", "3月", "4月"];

/** 随滚动生长的时间线条 */
export function GrowingLine() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void loadGsapWithScrollTrigger().then(({ gsap }) => {
      if (cancelled) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 5%", scrub: true },
          },
        );
        gsap.from("[data-mark]", {
          opacity: 0,
          y: 10,
          stagger: 0.38,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 4%", scrub: true },
        });
      }, el);

      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={root} data-timeline-start="top 82%" className="w-full lg:w-[138%]">
      <div className="relative h-[3px] w-full bg-border">
        <div data-line data-timeline-line="true" className="absolute inset-0 h-full bg-primary" />
      </div>
      <div className="mt-4 flex justify-between">
        {marks.map((m) => (
          <span key={m} data-mark className="text-xs tracking-widest text-muted-foreground">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
