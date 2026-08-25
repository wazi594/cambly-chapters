export const PAINT_FRAME_INTERVAL_MS = 1000 / 30;
export const PAINT_SCROLL_FRAME_INTERVAL_MS = 1000 / 8;
export const PAINT_MAX_PIXEL_RATIO = 1.25;

export function shouldRenderPaintFrame(
  lastFrame: number,
  now: number,
  visible: boolean,
  reducedMotion: boolean,
  scrolling = false,
) {
  if (!visible || reducedMotion) return false;
  const interval = scrolling ? PAINT_SCROLL_FRAME_INTERVAL_MS : PAINT_FRAME_INTERVAL_MS;
  return now - lastFrame >= interval - 1;
}
