import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/paint-store";

const marks = ["11月", "12月", "1月", "2月", "3月", "4月"];

/** 随滚动生长的时间线条 */
export function GrowingLine() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from("[data-mark]", {
        opacity: 0,
        y: 10,
        stagger: 0.18,
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="w-full">
      <div className="relative h-px w-full bg-border">
        <div data-line className="absolute inset-0 h-px bg-primary" />
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
