import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setPaintTint, prefersReducedMotion } from "@/lib/paint-store";
import type { Chapter } from "@/content/site";

type Props = {
  chapter: Chapter;
  children?: ReactNode;
  mediaChildren?: ReactNode;
  first?: boolean;
};

export function ChapterSection({ chapter, children, mediaChildren, first = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const Heading = first ? "h1" : "h2";

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
        onEnter: () => setPaintTint(chapter.tint, chapter.deep),
        onEnterBack: () => setPaintTint(chapter.tint, chapter.deep),
      });

      if (reduced) return;

      const fromLeft = chapter.align === "image-right";
      const layers = el.querySelectorAll<HTMLElement>("[data-anim]");
      gsap.from(layers, {
        yPercent: 18,
        xPercent: fromLeft ? -6 : 6,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });

      const reveal = el.querySelector<HTMLElement>("[data-image-reveal]");
      const img = el.querySelector<HTMLElement>("[data-image]");
      const slats = el.querySelectorAll<HTMLElement>("[data-slat]");
      const st = { trigger: el, start: "top 68%" } as const;

      if (reveal && img) {
        switch (chapter.reveal) {
          case "curtain":
            gsap.from(reveal, {
              clipPath: "inset(100% 0 0 0)",
              duration: 1.2,
              ease: "power4.inOut",
              scrollTrigger: st,
            });
            gsap.from(img, {
              yPercent: 12,
              scale: 1.12,
              duration: 1.6,
              ease: "power3.out",
              scrollTrigger: st,
            });
            break;
          case "iris":
            gsap.from(reveal, {
              clipPath: "circle(6% at 50% 58%)",
              duration: 1.5,
              ease: "power3.inOut",
              scrollTrigger: st,
            });
            gsap.from(img, {
              scale: 1.2,
              rotate: 1.5,
              duration: 1.8,
              ease: "power3.out",
              scrollTrigger: st,
            });
            break;
          case "slats":
            gsap.from(slats, {
              scaleY: 1,
              transformOrigin: "top center",
              duration: 0.9,
              ease: "power3.inOut",
              stagger: { each: 0.09, from: "random" },
              scrollTrigger: st,
            });
            gsap.from(img, { scale: 1.1, duration: 1.6, ease: "power2.out", scrollTrigger: st });
            break;
          case "tilt":
            gsap.from(reveal, {
              clipPath: "inset(0 0 100% 0)",
              rotate: -1.6,
              yPercent: 8,
              duration: 1.25,
              ease: "power4.out",
              scrollTrigger: st,
            });
            gsap.from(img, {
              scale: 1.14,
              xPercent: -6,
              duration: 1.7,
              ease: "power3.out",
              scrollTrigger: st,
            });
            break;
          default:
            gsap.from(reveal, {
              clipPath: fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
              duration: 1.35,
              ease: "power4.inOut",
              scrollTrigger: st,
            });
            gsap.from(img, { scale: 1.16, duration: 1.8, ease: "power3.out", scrollTrigger: st });
        }
      }

      const drift = el.querySelector<HTMLElement>("[data-drift]");
      if (drift) {
        gsap.to(drift, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      if (img) {
        gsap.to(img, {
          yPercent: chapter.align === "image-right" ? -6 : -10,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [chapter.tint, chapter.deep, chapter.reveal, chapter.align]);

  const media = chapter.media ?? "image";

  return (
    <section
      ref={root}
      id={chapter.id}
      className="relative flex min-h-screen scroll-mt-20 items-center border-t border-border/70 px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {media === "none" ? null : (
          <figure
            className={`editorial-figure group relative lg:col-span-7 ${chapter.align === "image-right" ? "order-2 lg:order-2" : ""}`}
          >
            <div
              data-image-reveal
              className={`relative overflow-hidden bg-muted/40 ${first ? "aspect-[16/9]" : "aspect-[4/5]"}`}
            >
              {mediaChildren ? (
                mediaChildren
              ) : media === "image" ? (
                <img
                  data-image
                  src={chapter.image}
                  alt={chapter.imageAlt}
                  width={first ? 1600 : 1200}
                  height={first ? 900 : 1500}
                  loading={first ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                />
              ) : (
                <div aria-hidden className="h-full w-full border border-dashed border-border/70" />
              )}
              {!mediaChildren && media === "image" && chapter.reveal === "slats" ? (
                <div aria-hidden className="pointer-events-none absolute inset-0 flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      data-slat
                      className="h-full flex-1 origin-top scale-y-0 bg-background"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </figure>
        )}

        <div
          className={`relative ${media === "none" ? "lg:col-span-12" : "lg:col-span-5"} ${chapter.align === "image-right" ? "order-1 lg:order-1 lg:pr-8" : "lg:pl-8"}`}
        >
          {chapter.index.trim() ? (
            <div data-anim className="mb-8 flex items-center gap-4">
              <span className="font-display text-3xl italic text-primary">{chapter.index}.</span>
              <span className="h-px w-12 bg-primary" />
            </div>
          ) : null}
          <Heading
            data-anim
            data-drift
            className={
              first ? "text-5xl leading-[1.05] md:text-7xl" : "text-4xl leading-tight md:text-6xl"
            }
          >
            {chapter.headline}
          </Heading>
          <p
            data-anim
            className="mt-8 max-w-md text-base leading-loose text-foreground/75 md:text-lg"
          >
            {chapter.line}
          </p>
          {first ? (
            <div data-anim data-chapter-stat="true" className="mt-10 border-t border-border pt-6">
              {chapter.stat.secondaryValue ? (
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="flex items-baseline gap-2">
                    <strong className="font-display text-5xl font-normal text-primary">
                      {chapter.stat.value}
                    </strong>
                    <span className="font-mono text-[0.65rem] tracking-[0.16em] text-foreground/55">
                      {chapter.stat.label}
                    </span>
                  </span>
                  <span aria-hidden className="font-display text-3xl text-primary/45">
                    /
                  </span>
                  <span className="flex items-baseline gap-2">
                    <strong className="font-display text-5xl font-normal text-primary">
                      {chapter.stat.secondaryValue}
                    </strong>
                    <span className="font-mono text-[0.65rem] tracking-[0.12em] text-foreground/55">
                      {chapter.stat.secondaryLabel}
                    </span>
                  </span>
                </div>
              ) : (
                <strong className="font-display text-5xl font-normal text-primary">
                  {chapter.stat.value}
                </strong>
              )}
            </div>
          ) : null}
          {children ? (
            <div data-anim className="mt-10">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
