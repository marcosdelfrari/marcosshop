"use client";

import type { ComponentProps } from "react";
import Link from "next/link";

import { trackLotus } from "@/lib/lotus";

type TrackedLinkProps = ComponentProps<"a"> & {
  event: string;
  botao: string;
};

export function TrackedLink({
  event,
  botao,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackLotus(event, { botao });
        onClick?.(clickEvent);
      }}
    />
  );
}

type TrackedRouteProps = ComponentProps<typeof Link> & {
  event: string;
  botao: string;
};

export function TrackedRoute({
  event,
  botao,
  onClick,
  ...props
}: TrackedRouteProps) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        trackLotus(event, { botao });
        onClick?.(clickEvent);
      }}
    />
  );
}
