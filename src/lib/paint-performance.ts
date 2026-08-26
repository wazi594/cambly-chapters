export const PAINT_FRAME_INTERVAL_MS = 1000 / 60;
export const PAINT_MAX_PIXEL_RATIO = 1.25;
const PAINT_TOUCH_FRAME_INTERVAL_MS = 1000 / 30;

export function shouldRenderPaintFrame(
  lastFrame: number,
  now: number,
  visible: boolean,
  reducedMotion: boolean,
  touchDevice = false,
) {
  if (!visible || reducedMotion) return false;

  const interval = touchDevice ? PAINT_TOUCH_FRAME_INTERVAL_MS : PAINT_FRAME_INTERVAL_MS;
  return now - lastFrame >= interval - 1;
}
