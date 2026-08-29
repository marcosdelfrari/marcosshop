import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { works } from "@/lib/works";

function buildCatalog(lang: Locale) {
  return {
    lang,
    locales: [...locales],
    works: works.map((work) => ({
      slug: work.slug,
      title: work.content[lang].title,
      medium: work.medium,
      year: work.year,
      dimensions: work.dimensions,
      price: `${work.price.amount} ${work.price.currency}`,
      available: work.available,
      description: work.content[lang].description.split("\n\n")[0] ?? "",
      url: `/${lang}/works/${work.slug}`,
    })),
    whatsappNumber: siteConfig.whatsappNumber,
    discovery: {
      llmsTxt: absoluteUrl("/llms.txt"),
      agentSkills: absoluteUrl("/.well-known/agent-skills/index.json"),
      aiCatalog: absoluteUrl("/.well-known/ai-catalog.json"),
      apiCatalog: absoluteUrl("/.well-known/api-catalog"),
      mcpServerCard: absoluteUrl("/.well-known/mcp/server-card.json"),
      mcpEndpoint: absoluteUrl("/mcp"),
      sitemap: absoluteUrl("/sitemap.xml"),
    },
  };
}

export function buildWebMcpInitScript(lang: Locale): string {
  const catalog = buildCatalog(lang);

  return `(function(){
  var catalog = ${JSON.stringify(catalog)};
  var modelContext = (typeof document !== "undefined" && document.modelContext)
    || (typeof navigator !== "undefined" && navigator.modelContext);
  if (!modelContext || typeof modelContext.registerTool !== "function") return;

  var controller = new AbortController();
  var options = { signal: controller.signal };

  function findWork(slug) {
    for (var i = 0; i < catalog.works.length; i++) {
      if (catalog.works[i].slug === slug) return catalog.works[i];
    }
    return null;
  }

  function buildWhatsAppUrl(payload) {
    var lines = [
      'Hello! I\\'m interested in "' + payload.workTitle + '".',
      "",
      "Name: " + payload.name,
      "Email: " + payload.email,
      "Phone: " + payload.phone,
      "Work: " + payload.workSlug,
      "Language: " + payload.locale
    ];
    return "https://wa.me/" + catalog.whatsappNumber + "?text=" + encodeURIComponent(lines.join("\\n"));
  }

  var tools = [
    {
      name: "list_works",
      description: "List available original prints and paintings in the Marcos Lucas shop catalogue.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: function() {
        return {
          locale: catalog.lang,
          works: catalog.works
        };
      }
    },
    {
      name: "get_work",
      description: "Get detailed information about a single artwork by slug.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Work slug, e.g. oni, demon, curva-da-felicidade."
          }
        },
        required: ["slug"]
      },
      execute: function(input) {
        var work = findWork(input && input.slug);
        if (!work) {
          return { error: "Work not found", slug: input && input.slug };
        }
        return work;
      }
    },
    {
      name: "navigate_to",
      description: "Navigate the browser to a shop page such as works, about, privacy, or a work detail URL.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Absolute path on this site, e.g. /en, /en/about, /en/works/oni."
          }
        },
        required: ["path"]
      },
      execute: function(input) {
        var path = input && input.path;
        if (!path || typeof path !== "string" || path.charAt(0) !== "/") {
          return { error: "Invalid path. Use an absolute path starting with /." };
        }
        window.location.assign(path);
        return { navigatedTo: path };
      }
    },
    {
      name: "open_whatsapp_inquiry",
      description: "Open WhatsApp to inquire about purchasing an artwork. Requires work slug and contact details.",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Work slug to inquire about." },
          name: { type: "string", description: "Visitor name." },
          email: { type: "string", description: "Visitor email." },
          phone: { type: "string", description: "Visitor phone number." }
        },
        required: ["slug", "name", "email", "phone"]
      },
      execute: function(input) {
        var work = findWork(input && input.slug);
        if (!work) {
          return { error: "Work not found", slug: input && input.slug };
        }
        if (!work.available) {
          return { error: "Work unavailable", slug: work.slug };
        }
        var url = buildWhatsAppUrl({
          workTitle: work.title,
          workSlug: work.slug,
          name: String(input.name || ""),
          email: String(input.email || ""),
          phone: String(input.phone || ""),
          locale: catalog.lang
        });
        window.open(url, "_blank", "noopener,noreferrer");
        return { opened: true, url: url, work: work.slug };
      }
    },
    {
      name: "get_discovery",
      description: "Return agent discovery endpoints for this shop (llms.txt, API catalog, MCP, agent skills, sitemap).",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: function() {
        return catalog.discovery;
      }
    }
  ];

  tools.forEach(function(tool) {
    modelContext.registerTool(tool, options).catch(function(){});
  });

  window.addEventListener("pagehide", function() {
    controller.abort();
  }, { once: true });
})();`;
}
