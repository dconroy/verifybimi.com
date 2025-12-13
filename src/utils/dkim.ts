export interface DkimParseResult {
  raw: string;
  selector: string | null;
  publicKey: string | null;
  keyType: string | null;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

function normalizeDomainInput(domain: string): string {
  let d = domain.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  d = d.replace(/\/.*$/, '');
  d = d.replace(/^\*\./, '');
  return d;
}

/**
 * Constructs the DKIM selector query name.
 * If selector is provided, uses it; otherwise uses common default selectors.
 */
export function dkimQname(domain: string, selector?: string): string {
  const d = normalizeDomainInput(domain);
  if (selector) {
    return `${selector}._domainkey.${d}`;
  }
  // Try common default selectors
  return `default._domainkey.${d}`;
}

/**
 * Parses a DKIM public key record.
 * DKIM records are TXT records that contain key-value pairs.
 */
/**
 * Common DKIM selectors to try when auto-detecting.
 * These are commonly used by various email providers.
 */
export const COMMON_DKIM_SELECTORS = [
  'default',
  'selector1',
  'selector2',
  'google',
  'mail',
  'dkim',
  's1',
  's2',
  'key1',
  'key2',
  '2023',
  '2024',
];

export function parseDkimRecord(rawTxt: string, selector?: string): DkimParseResult {
  const raw = rawTxt.trim();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw) {
    return {
      raw,
      selector: selector || null,
      publicKey: null,
      keyType: null,
      errors: ['No DKIM record found.'],
      warnings: [],
      isValid: false,
    };
  }

  // DKIM records are semicolon-separated key=value pairs
  const tags: Record<string, string> = {};
  const parts = raw
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) {
      warnings.push(`Unrecognized DKIM token "${part}" (expected key=value).`);
      continue;
    }
    const key = part.slice(0, eqIdx).trim().toLowerCase();
    const value = part.slice(eqIdx + 1).trim();
    if (!key) continue;
    tags[key] = value;
  }

  // Validate required tags
  const v = tags['v'];
  if (v !== 'DKIM1') {
    errors.push(`Invalid or missing DKIM version. Expected "v=DKIM1", found "${v || 'none'}".`);
  }

  const k = tags['k'] || tags['key-type'] || 'rsa'; // default is RSA
  if (!['rsa', 'ed25519'].includes(k.toLowerCase())) {
    warnings.push(`Uncommon key type "${k}". Standard types are: rsa, ed25519.`);
  }

  const p = tags['p'] || tags['public-key'];
  if (!p) {
    errors.push('Missing required DKIM public key (p= tag).');
  } else {
    // Basic validation: public key should be base64
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(p.replace(/\s/g, ''))) {
      warnings.push('DKIM public key may not be valid base64 format.');
    }
    // Check key length (RSA keys are typically longer)
    const keyLength = p.replace(/\s/g, '').length;
    if (keyLength < 100) {
      warnings.push('DKIM public key appears unusually short. Verify the key is complete.');
    }
  }

  // Check for optional but recommended tags
  if (!tags['h']) {
    warnings.push('No hash algorithm (h=) specified. Default is sha256.');
  } else {
    const h = tags['h'].toLowerCase();
    if (!h.includes('sha256') && !h.includes('sha1')) {
      warnings.push(`Hash algorithm "${h}" may not be widely supported. sha256 is recommended.`);
    }
  }

  const isValid = errors.length === 0 && v === 'DKIM1' && !!p;

  return {
    raw,
    selector: selector || null,
    publicKey: p || null,
    keyType: k || null,
    errors,
    warnings,
    isValid,
  };
}

export function pickLikelyDkimRecord(txtAnswers: string[]): string | null {
  if (!txtAnswers.length) return null;
  const exact = txtAnswers.find((a) => a.toLowerCase().includes('v=dkim1'));
  return exact || txtAnswers[0] || null;
}

