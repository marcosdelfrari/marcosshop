"use client";

import Image from "next/image";
import { useState } from "react";

type WorkGalleryProps = {
  images: string[];
  title: string;
};

export function WorkGallery({ images, title }: WorkGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = images[activeIndex] ?? images[0];

  if (!activeSrc) return null;

  return (
    <div className="space-y-4">
      <div className="w-full">
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={activeIndex === 0 ? title : `${title} — ${activeIndex + 1}`}
          width={1600}
          height={1600}
          priority={activeIndex === 0}
          className="mx-auto h-auto max-h-[75vh] w-full object-contain"
          sizes="(max-width: 768px) 100vw, 48rem"
        />
      </div>

      {images.length > 1 ? (
        <div
          className="grid grid-cols-4 gap-2 sm:grid-cols-5"
          role="tablist"
          aria-label={title}
        >
          {images.map((src, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${title} — ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden transition-opacity ${
                  selected
                    ? "opacity-100 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
