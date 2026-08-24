// 极简共享状态：主页章节把目标色写进来，Three.js 画布逐帧平滑跟随。
type RGB = [number, number, number];

const state: { tint: RGB } = { tint: [0.93, 0.9, 0.83] };

export function setPaintTint(tint: RGB) {
  state.tint = tint;
}

export function getPaintTint(): RGB {
  return state.tint;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
