export const PAINT_FRAME_INTERVAL_MS = 1000 / 30;
export const PAINT_MAX_PIXEL_RATIO = 1.25;

export function shouldRenderPaintFrame(
  lastFrame: number,
  now: number,
  visible: boolean,
  reducedMotion: boolean,
  scrolling = false,
) {
  return visible && !reducedMotion && !scrolling && now - lastFrame >= PAINT_FRAME_INTERVAL_MS - 1;
}
