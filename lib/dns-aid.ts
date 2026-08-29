import { SITE_URL } from "@/lib/seo";

/** DNS zone that owns shop.marcosdelfrari.com (Vercel DNS). */
export const DNS_AID_ZONE = "marcosdelfrari.com";

export type DnsAidRecord = {
  /** Record name relative to the zone (without trailing dot). */
  name: string;
  priority: number;
  target: string;
  params: string;
  comment: string;
};

function hostname(): string {
  return new URL(SITE_URL).hostname;
}

/**
 * ServiceMode HTTPS/SVCB records for DNS-AID discovery.
 * @see https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
 * @see https://www.rfc-editor.org/rfc/rfc9460
 */
export function buildDnsAidRecords(): DnsAidRecord[] {
  const target = hostname();

  return [
    {
      name: `_index._agents.shop`,
      priority: 1,
      target,
      params: 'alpn="h2,h3" port=443',
      comment: "DNS-AID organizational index entry point",
    },
    {
      name: `_a2a._agents.shop`,
      priority: 1,
      target,
      params: 'alpn="h2,h3" port=443',
      comment: "DNS-AID agent discovery entry (HTTPS catalog + skills)",
    },
    {
      name: `_mcp._agents.shop`,
      priority: 1,
      target,
      params: 'alpn="mcp,h2,h3" port=443 mandatory=alpn,port',
      comment: "DNS-AID MCP server discovery (Streamable HTTP at /mcp)",
    },
  ];
}

export function dnsAidOwnerNames(): string[] {
  return buildDnsAidRecords().map(
    (record) => `${record.name}.${DNS_AID_ZONE}`,
  );
}

export function formatDnsAidZoneEntry(record: DnsAidRecord): string {
  const fqdn = `${record.name}.${DNS_AID_ZONE}`;
  return `${fqdn}. 3600 IN HTTPS ${record.priority} ${record.target}. ${record.params}`;
}
