export type StoryHelixPose = {
  angle: number;
  depth: number;
  offset: number;
  opacity: number;
  x: number;
  y: number;
  zIndex: number;
};

export function getStoryHelixPose(index: number, count: number): StoryHelixPose {
  const offset = index - (count - 1) / 2;
  const angle = offset * 22;
  const radians = (angle * Math.PI) / 180;

  return {
    angle,
    depth: Math.round((Math.cos(radians) - 1) * 153.5),
    offset,
    opacity: Number(Math.max(0.2, 1 - Math.abs(offset) * 0.17).toFixed(2)),
    x: Math.round(Math.sin(radians) * 184.1),
    y: offset * 64,
    zIndex: count - Math.floor(Math.abs(offset)),
  };
}
