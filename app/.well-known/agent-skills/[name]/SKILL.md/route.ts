import { NextResponse } from "next/server";

import {
  AGENT_SKILLS_CORS_HEADERS,
  getAgentSkill,
} from "@/lib/agent-skills";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/.well-known/agent-skills/[name]/SKILL.md">,
) {
  const { name } = await params;
  const skill = getAgentSkill(name);

  if (!skill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(skill.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...AGENT_SKILLS_CORS_HEADERS,
    },
  });
}

export async function HEAD(
  _request: Request,
  { params }: RouteContext<"/.well-known/agent-skills/[name]/SKILL.md">,
) {
  const { name } = await params;
  const skill = getAgentSkill(name);

  if (!skill) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(skill.content, "utf8")),
      "Cache-Control": "public, max-age=3600",
      ...AGENT_SKILLS_CORS_HEADERS,
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: AGENT_SKILLS_CORS_HEADERS,
  });
}
