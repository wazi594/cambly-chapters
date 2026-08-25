/** Load browser-only animation code after hydration so SSR runtimes never evaluate GSAP. */
export async function loadGsapWithScrollTrigger() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
