// Auto-redact: the sensitive data in a screenshot's recognised text (ocr.ts), which the editor pixelates before the
// image can leave the Mac. Pure, so the patterns are tested in plain Node.
import type { Box, OcrLine } from './ocr';

// Card numbers pass the Luhn check.
export function luhn(s: string): boolean {
  const d = s.replace(/\D/g, '');
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) n = n * 2 > 9 ? n * 2 - 9 : n * 2;
    sum += n;
  }
  return sum % 10 === 0;
}

// IBANs: the country and check digits moved to the end, letters as 10–35, mod 97 is 1.
export function iban(s: string): boolean {
  const c = s.replace(/ /g, '');
  const digits = (c.slice(4) + c.slice(0, 4)).replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let rest = 0;
  for (const ch of digits) rest = (rest * 10 + Number(ch)) % 97;
  return rest === 1;
}

// Keys and tokens without a known prefix: upper and lower case and digits mixed, and 4 bits of entropy a character or
// more. Words, version strings and hex hashes stay under it; paths have a slash every few characters, Base64 rarely.
export function random(s: string): boolean {
  if (!/[a-z]/.test(s) || !/[A-Z]/.test(s) || !/\d/.test(s) || s.split('/').length - 1 > s.length / 16) return false;
  const counts = new Map<string, number>();
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const bits = -[...counts.values()].reduce((sum, n) => sum + (n / s.length) * Math.log2(n / s.length), 0);
  return bits >= 4;
}

const hasDigit = (s: string) => /\d/.test(s);

// `ok` checks what a pattern alone cannot: a checksum, or that it looks random.
const PATTERNS: { re: RegExp; ok?: (s: string) => boolean }[] = [
  { re: /[\w.%+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi }, // email
  { re: /\b(?:sk|rk)[-_][\w-]{16,}/g, ok: hasDigit }, // OpenAI and Anthropic sk-…, Stripe sk_live_… and rk_live_…
  { re: /\b(?:gh[pousr]_\w{20,}|github_pat_\w{20,})/g }, // GitHub
  { re: /\bxox[abposr]-[\w-]{10,}/g }, // Slack
  { re: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g }, // AWS access key ID
  { re: /\bAIza[\w-]{30,}/g }, // Google API key
  { re: /\beyJ[\w-]{10,}(?:\.[\w-]*){0,2}/g }, // JWT
  { re: /BEGIN (?:[A-Z]+ )*PRIVATE KEY/g }, // PEM private key header
  { re: /\b\d(?:[ -]?\d){12,18}\b/g, ok: luhn }, // card number
  { re: /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,3})?\b/g, ok: iban }, // IBAN
  { re: /[\w+/=-]{32,}/g, ok: random }, // any other key or token
];

// Where a line of text holds something sensitive: [start, end) ranges, sorted, overlaps merged.
export function findSecrets(text: string): [number, number][] {
  const found: [number, number][] = [];
  for (const { re, ok } of PATTERNS) for (const m of text.matchAll(re)) if (!ok || ok(m[0])) found.push([m.index, m.index + m[0].length]);
  found.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of found) {
    const last = merged.at(-1);
    if (last && s < last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
}

// One box per secret, over the whole words it touches and a little past them, so no stroke of a letter shows.
export function secretBoxes(lines: OcrLine[]): Box[] {
  return lines.flatMap((l) =>
    findSecrets(l.text).map(([s, e]) => {
      const ws = l.words.filter((w) => w.start < e && w.end > s);
      const parts = ws.length ? ws : [l];
      const [x, y] = [Math.min(...parts.map((w) => w.x)), Math.min(...parts.map((w) => w.y))];
      const [r, b] = [Math.max(...parts.map((w) => w.x + w.w)), Math.max(...parts.map((w) => w.y + w.h))];
      const pad = Math.max(2, (b - y) * 0.15);
      const [x0, y0] = [Math.max(0, Math.floor(x - pad)), Math.max(0, Math.floor(y - pad))];
      return { x: x0, y: y0, w: Math.ceil(r + pad) - x0, h: Math.ceil(b + pad) - y0 };
    }),
  );
}
