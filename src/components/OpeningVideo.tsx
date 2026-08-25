export function OpeningVideo() {
  return (
    <video
      data-image
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="A room with perspective 动态空间"
      className="h-full w-full object-cover"
    >
      <source src="/media/room-with-perspective.mp4" type="video/mp4" />
    </video>
  );
}
