"use client";

import { useEffect, useState } from "react";

const AVATAR_WEBM = "/avatar.webm";
const AVATAR_MOV = "/avatar.mov";
const AVATAR_FALLBACK = "/avatar.png";

const DEFAULT_CLASS = "h-[180px] w-[180px]";

type AvatarVideoProps = {
  className?: string;
};

function prefersSafari(): boolean {
  if (typeof navigator === "undefined") return true;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

export function AvatarVideo({ className = DEFAULT_CLASS }: AvatarVideoProps) {
  const [useFallback, setUseFallback] = useState(false);
  // Default to .mov (Safari / Memoji native alpha). Chrome switches to WebM after mount.
  const [src, setSrc] = useState(AVATAR_MOV);

  useEffect(() => {
    if (!prefersSafari()) setSrc(AVATAR_WEBM);
  }, []);

  if (useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static fallback when video formats fail
      <img
        src={AVATAR_FALLBACK}
        alt="Artist avatar"
        className={className}
        width={180}
        height={180}
      />
    );
  }

  return (
    <video
      key={src}
      className={className}
      src={src}
      width={180}
      height={180}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Artist avatar"
      onError={() => setUseFallback(true)}
    />
  );
}
