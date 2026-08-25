import assert from "node:assert/strict";
import test from "node:test";
import {
  PAINT_FRAME_INTERVAL_MS,
  PAINT_MAX_PIXEL_RATIO,
  shouldRenderPaintFrame,
} from "./paint-performance.ts";

test("paint frame scheduling stops continuous work when motion is reduced or the page is hidden", () => {
  assert.equal(shouldRenderPaintFrame(0, 40, false, false), false);
  assert.equal(shouldRenderPaintFrame(0, 40, true, true), false);
});

test("paint frame scheduling caps animation near thirty frames per second", () => {
  assert.equal(PAINT_FRAME_INTERVAL_MS, 1000 / 30);
  assert.equal(PAINT_MAX_PIXEL_RATIO, 1.25);
  assert.equal(shouldRenderPaintFrame(100, 120, true, false), false);
  assert.equal(shouldRenderPaintFrame(100, 134, true, false), true);
});

test("paint rendering throttles, but does not freeze, during active page scrolling", () => {
  assert.equal(shouldRenderPaintFrame(100, 134, true, false, true), false);
  assert.equal(shouldRenderPaintFrame(100, 134, true, false, false), true);
  // Scrolling must still yield occasional frames so the flow/cursor never
  // visibly freezes for the duration of a long or momentum-driven scroll.
  assert.equal(shouldRenderPaintFrame(100, 300, true, false, true), true);
});
