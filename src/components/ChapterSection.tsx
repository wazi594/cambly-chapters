import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setPaintTint, prefersReducedMotion } from "@/lib/paint-store";
import type { Chapter } from "@/content/site";

type Props = {
  chapter: Chapter;
  children?: ReactNode;
  first?: boolean;
};

export function ChapterSection({ chapter, children, first = false }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // 章节进入视口时切换背景色调
      ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => setPaintTint(chapter.tint),
        onEnterBack: () => setPaintTint(chapter.tint),
      });

      if (reduced) return;

      const layers = el.querySelectorAll<HTMLElement>("[data-anim]");
      gsap.from(layers, {
        yPercent: 42,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });

      const drift = el.querySelector<HTMLElement>("[data-drift]");
      if (drift) {
        gsap.to(drift, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [chapter.tint]);

  return (
    <section
      ref={root}
      id={chapter.id}
      className="relative flex min-h-screen items-center px-6 py-28 md:px-16"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div data-anim className="mb-8 flex items-center gap-4">
          <span className="font-serif-cn text-sm tracking-[0.4em] text-primary">
            {chapter.index}
          </span>
          <span className="h-px w-16 bg-border" />
          <span className="text-xs tracking-[0.35em] text-muted-foreground">{chapter.label}</span>
        </div>

        <h2
          data-anim
          data-drift
          className={
            first
              ? "font-serif-cn text-5xl leading-[1.15] text-foreground md:text-7xl"
              : "font-serif-cn text-3xl leading-[1.3] text-foreground md:text-5xl"
          }
        >
          {chapter.headline}
        </h2>

        <p data-anim className="mt-8 max-w-xl text-base leading-loose text-foreground/75 md:text-lg">
          {chapter.line}
        </p>

        {children ? (
          <div data-anim className="mt-14">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
