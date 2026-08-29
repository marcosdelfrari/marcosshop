import {
  AGENT_SKILLS_CORS_HEADERS,
  buildAgentSkillsIndex,
} from "@/lib/agent-skills";

export function GET() {
  return Response.json(buildAgentSkillsIndex(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...AGENT_SKILLS_CORS_HEADERS,
    },
  });
}

export function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
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
