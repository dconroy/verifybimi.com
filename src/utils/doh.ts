export type DnsRecordType = 'TXT';

export type DohResolverId = 'cloudflare' | 'google';

export interface DohResolver {
  id: DohResolverId;
  label: string;
  /**
   * Used for display only. These are public recursive resolvers (not authoritative NS).
   */
  description: string;
  /**
   * Returns a URL to fetch JSON DNS results for `name` and `type`.
   */
  buildUrl: (name: string, type: DnsRecordType) => string;
  /**
   * Some resolvers require specific headers.
   */
  headers?: Record<string, string>;
}

export interface DohAnswer {
  name?: string;
  type?: number;
  ttl?: number;
  data?: string;
}

export interface DohJsonResponse {
  Status?: number;
  TC?: boolean;
  RD?: boolean;
  RA?: boolean;
  AD?: boolean;
  CD?: boolean;
  Question?: Array<{ name: string; type: number }>;
  Answer?: DohAnswer[];
  Comment?: string;
}

export interface DohLookupResult {
  resolver: DohResolver;
  qname: string;
  qtype: DnsRecordType;
  status: number | null;
  answers: string[];
  raw: DohJsonResponse | null;
  error?: string;
}

export const DOH_RESOLVERS: DohResolver[] = [
  {
    id: 'cloudflare',
    label: 'Cloudflare (1.1.1.1)',
    description: 'Public recursive resolver via DoH (application/dns-json).',
    buildUrl: (name, type) =>
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
    headers: {
      accept: 'application/dns-json',
    },
  },
  {
    id: 'google',
    label: 'Google (8.8.8.8)',
    description: 'Public recursive resolver via DoH JSON API.',
    buildUrl: (name, type) =>
      `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
  },
];

export function getDefaultResolver(): DohResolver {
  return DOH_RESOLVERS[0];
}

/**
 * DNS JSON TXT answers often come back as quoted strings. This normalizes them.
 * Example: "\"v=DMARC1; p=none\"" -> "v=DMARC1; p=none"
 */
export function normalizeTxtData(txt: string): string {
  let s = txt.trim();
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    s = s.slice(1, -1);
  }
  // Unescape a few common sequences used in JSON/zone presentations
  s = s.replace(/\\"/g, '"');
  s = s.replace(/\\;/g, ';');
  return s.trim();
}

export async function dohLookupTxt(name: string, resolver: DohResolver): Promise<DohLookupResult> {
  const url = resolver.buildUrl(name, 'TXT');
  const resultBase: DohLookupResult = {
    resolver,
    qname: name,
    qtype: 'TXT',
    status: null,
    answers: [],
    raw: null,
  };

  try {
    const resp = await fetch(url, {
      headers: resolver.headers,
    });

    if (!resp.ok) {
      return {
        ...resultBase,
        error: `DNS query failed (${resp.status} ${resp.statusText})`,
      };
    }

    const json = (await resp.json()) as DohJsonResponse;
    const answers = (json.Answer || [])
      .map((a) => (typeof a.data === 'string' ? normalizeTxtData(a.data) : ''))
      .filter(Boolean);

    return {
      ...resultBase,
      status: typeof json.Status === 'number' ? json.Status : null,
      answers,
      raw: json,
    };
  } catch (e) {
    return {
      ...resultBase,
      error: e instanceof Error ? e.message : 'DNS query failed',
    };
  }
}


