"use client";

export function AvatarVideo({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="/avatar.mov"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Artist avatar"
    />
  );
}
