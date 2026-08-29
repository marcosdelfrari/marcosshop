"use client";

import { useState } from "react";

/** VP9/WebM: Chrome, Firefox, Edge. QuickTime/MOV: Safari. */
const AVATAR_WEBM = "/avatar.webm";
const AVATAR_MOV = "/avatar.mov";
const AVATAR_FALLBACK = "/avatar.png";

export function AvatarVideo({ className }: { className?: string }) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static fallback when video formats fail
      <img
        src={AVATAR_FALLBACK}
        alt="Artist avatar"
        className={className}
        width={640}
        height={480}
      />
    );
  }

  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={AVATAR_FALLBACK}
      aria-label="Artist avatar"
      onError={() => setUseFallback(true)}
    >
      <source src={AVATAR_WEBM} type="video/webm; codecs=vp9" />
      <source src={AVATAR_MOV} type='video/quicktime; codecs="hvc1"' />
    </video>
  );
}
