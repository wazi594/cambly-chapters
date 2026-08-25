import { useEffect } from "react";
import Lenis from "lenis";
import { loadGsapWithScrollTrigger } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/paint-store";

/** Lenis 平滑滚动 + 与 GSAP ScrollTrigger 同步。仅客户端使用。 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void loadGsapWithScrollTrigger().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const onRaf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onRaf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(onRaf);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
