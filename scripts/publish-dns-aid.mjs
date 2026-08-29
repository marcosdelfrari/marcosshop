#!/usr/bin/env node

/**
 * Publish DNS-AID HTTPS records to Vercel DNS for shop.marcosdelfrari.com.
 *
 * Usage:
 *   node scripts/publish-dns-aid.mjs --dry-run
 *   VERCEL_ACCESS_TOKEN=… node scripts/publish-dns-aid.mjs
 *
 * DNSSEC: Vercel DNS does not sign zones. For authenticated answers, move DNS
 * to a provider with DNSSEC (e.g. Cloudflare) and point A/CNAME at Vercel.
 */

const ZONE = "marcosdelfrari.com";
const TARGET = "shop.marcosdelfrari.com";
const TTL = 3600;

const RECORDS = [
  {
    name: "_index._agents.shop",
    priority: 1,
    target: TARGET,
    params: 'alpn="h2,h3" port=443',
    comment: "DNS-AID organizational index entry point",
  },
  {
    name: "_a2a._agents.shop",
    priority: 1,
    target: TARGET,
    params: 'alpn="h2,h3" port=443',
    comment: "DNS-AID agent discovery entry (HTTPS catalog + skills)",
  },
  {
    name: "_mcp._agents.shop",
    priority: 1,
    target: TARGET,
    params: 'alpn="mcp,h2,h3" port=443 mandatory=alpn,port',
    comment: "DNS-AID MCP server discovery (Streamable HTTP at /mcp)",
  },
];

const dryRun = process.argv.includes("--dry-run");
const token =
  process.env.VERCEL_ACCESS_TOKEN?.trim() ??
  process.env.VERCEL_TOKEN?.trim();

function zoneEntry(record) {
  return `${record.name}.${ZONE}. ${TTL} IN HTTPS ${record.priority} ${record.target}. ${record.params}`;
}

function normalizeHttpsRecord(record) {
  const https = record.https ?? {};
  return {
    name: record.name,
    priority: Number(https.priority ?? 0),
    target: (https.target ?? "").replace(/\.$/, ""),
    params: https.params ?? "",
  };
}

async function vercelFetch(path, options = {}) {
  const response = await fetch(`https://api.vercel.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      body?.error?.message ?? body?.message ?? response.statusText;
    throw new Error(`${response.status} ${message}`);
  }
  return body;
}

async function listRecords() {
  const data = await vercelFetch(`/v4/domains/${ZONE}/records?limit=100`);
  return data.records ?? [];
}

function recordBody(record) {
  return {
    type: "HTTPS",
    name: record.name,
    ttl: TTL,
    comment: record.comment,
    https: {
      priority: record.priority,
      target: record.target,
      params: record.params,
    },
  };
}

function recordsMatch(existing, desired) {
  return (
    existing.priority === desired.priority &&
    existing.target === desired.target &&
    existing.params === desired.params
  );
}

async function upsertRecord(existingRecords, desired) {
  const match = existingRecords.find(
    (row) => row.type === "HTTPS" && row.name === desired.name,
  );

  if (match) {
    const current = normalizeHttpsRecord(match);
    if (recordsMatch(current, desired)) {
      return { action: "unchanged", name: desired.name };
    }

    if (dryRun) {
      return { action: "would-update", name: desired.name };
    }

    await vercelFetch(`/v1/domains/records/${match.id}`, {
      method: "PATCH",
      body: JSON.stringify(recordBody(desired)),
    });
    return { action: "updated", name: desired.name };
  }

  if (dryRun) {
    return { action: "would-create", name: desired.name };
  }

  await vercelFetch(`/v2/domains/${ZONE}/records`, {
    method: "POST",
    body: JSON.stringify(recordBody(desired)),
  });
  return { action: "created", name: desired.name };
}

async function verifyViaDoh(ownerName) {
  const results = [];
  for (const type of ["HTTPS", "SVCB"]) {
    const url = new URL("https://cloudflare-dns.com/dns-query");
    url.searchParams.set("name", ownerName);
    url.searchParams.set("type", type);

    const response = await fetch(url, {
      headers: { Accept: "application/dns-json" },
    });
    const data = await response.json();
    const answers = (data.Answer ?? []).map((row) => row.data);
    if (answers.length) {
      results.push({ type, answers, ad: data.AD === true });
    }
  }
  return results;
}

async function main() {
  console.log("DNS-AID records for shop.marcosdelfrari.com\n");
  for (const record of RECORDS) {
    console.log(zoneEntry(record));
  }
  console.log("");

  if (dryRun && !token) {
    console.log("Dry run only — set VERCEL_ACCESS_TOKEN to publish.");
    console.log(
      "Manual fallback: Vercel Dashboard → marcosdelfrari.com → DNS → Add HTTPS record.",
    );
    console.log(
      "DNSSEC is not available on Vercel DNS; use Cloudflare DNS + DS at registrar for AD=true.",
    );
    return;
  }

  if (!token) {
    console.error("Missing VERCEL_ACCESS_TOKEN.");
    process.exit(1);
  }

  const existing = await listRecords();
  const results = [];

  for (const record of RECORDS) {
    results.push(await upsertRecord(existing, record));
  }

  for (const result of results) {
    console.log(`${result.action}: ${result.name}`);
  }

  console.log("\nWaiting 5s for propagation…");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (const record of RECORDS) {
    const owner = `${record.name}.${ZONE}`;
    const checks = await verifyViaDoh(owner);
    if (!checks.length) {
      console.log(`${owner}: no HTTPS/SVCB answer yet`);
      continue;
    }
    for (const check of checks) {
      console.log(
        `${owner} (${check.type}): ${check.answers.join("; ")}${check.ad ? " (DNSSEC AD)" : ""}`,
      );
    }
  }

  console.log(
    '\nValidate: curl -s https://isitagentready.com/api/scan -H "content-type: application/json" -d \'{"url":"https://shop.marcosdelfrari.com"}\' | jq .checks.discoverability.dnsAid',
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
