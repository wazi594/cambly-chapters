import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { getStoryHelixPose } from "@/lib/story-helix";

const teachers = [
  ["Tutor Mark", "tutor-mark", "THE WORLD, CLEARLY"],
  ["Sally HS", "sally-hs", "HAVE FAITH"],
  ["Kenneth D", "kenneth-d", "A NEW STAGE"],
  ["Susan Munro", "susan-munro", "A QUIET WITNESS"],
  ["Peter", "peter", "31 LESSONS"],
  ["Connie N", "connie-n", "THE NEXT SCRIPT"],
  ["Ellie / BJ", "ellie-bj", "TWO VOICES"],
  ["Olivia", "olivia", "WINGS"],
  ["Ian Smith", "ian-smith", "KEEP GOING"],
] as const;

export function StoryCardDeck() {
  const stageRef = useRef<HTMLUListElement>(null);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  function setStageTilt(x: number, y: number) {
    stageRef.current?.style.setProperty("--deck-rotate-x", `${y * -2}deg`);
    stageRef.current?.style.setProperty("--deck-rotate-y", `${x * 3}deg`);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      if (dragStartX.current === null) return;
      const distance = event.clientX - dragStartX.current;
      didDrag.current = Math.abs(distance) > 8;
      stageRef.current?.style.setProperty("--deck-rotate-y", `${distance * 0.12}deg`);
      return;
    }

    if ((event.target as Element).closest(".story-name-strip")) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    setStageTilt(
      (event.clientX - bounds.left) / bounds.width - 0.5,
      (event.clientY - bounds.top) / bounds.height - 0.5,
    );
  }

  function resetStage() {
    dragStartX.current = null;
    setStageTilt(0, 0);
  }

  return (
    <div
      className="story-deck-shell"
      onPointerDown={(event) => {
        if (event.pointerType === "touch") {
          dragStartX.current = event.clientX;
          didDrag.current = false;
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetStage}
      onPointerUp={resetStage}
      onPointerCancel={resetStage}
      onClickCapture={(event) => {
        if (didDrag.current) {
          event.preventDefault();
          didDrag.current = false;
        }
      }}
    >
      <div className="story-deck">
        <ul ref={stageRef} className="story-deck-stage" aria-label="九位老师的故事入口">
          {teachers.map(([name, slug, note], index) => {
            const pose = getStoryHelixPose(index, teachers.length);
            const style = {
              "--helix-angle": `${pose.angle}deg`,
              "--helix-counter-angle": `${pose.angle * -1}deg`,
              "--helix-depth": `${pose.depth}px`,
              "--helix-opacity": pose.opacity,
              "--helix-x": `${pose.x}px`,
              "--helix-x-mobile": `${Math.round(pose.x * 0.52)}px`,
              "--helix-y": `${pose.y}px`,
              zIndex: pose.zIndex,
            } as CSSProperties;

            return (
              <li key={slug} className="story-strip-item" style={style}>
                <Link
                  to="/stories"
                  hash={slug}
                  resetScroll
                  hashScrollIntoView={{ behavior: "instant", block: "start" }}
                  className="story-name-strip"
                  aria-label={`打开 ${name} 的故事`}
                >
                  <span className="story-strip-visual">
                    <span className="story-strip-name">{name}</span>
                    <span className="story-strip-note">{note}</span>
                    <span aria-hidden className="story-strip-arrow">
                      ↗
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
