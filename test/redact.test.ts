import assert from 'assert';
import { findSecrets, iban, luhn, random, secretBoxes } from '../src/redact';
import type { OcrLine } from '../src/ocr';

// What findSecrets marks in a line, as the strings themselves.
const found = (text: string) => findSecrets(text).map(([s, e]) => text.slice(s, e));

// Found, each on its own
for (const secret of [
  'jane.doe@example.com',
  'first.last+tag@mail.example.co.uk',
  'sk-proj-4f9aK2mQ7xL0pR8vB3nZ6wY1',
  'sk-ant-api03-Xy7Kq2Lm9Np4Rs6Tv8Wz1Ab3Cd5',
  'sk_live_51HxYz2AbCdEfGhIjKlMn',
  'ghp_aB3dE5fG7hJ9kL1mN3pQ5rS7tU9vW1xY3z',
  'github_pat_11ABCDEFG0abcdefghij_KLMNOPQRSTUVWXYZ0123456789',
  'xoxb-1234567890-0987654321-AbCdEfGhIjKl',
  'xoxp-2468013579-abcdefghij',
  'AKIAIOSFODNN7EXAMPLE',
  'AIzaSyD4f9aK2mQ7xL0pR8vB3nZ6wY1aBcDeFg',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
  '-----BEGIN RSA PRIVATE KEY-----',
  'BEGIN OPENSSH PRIVATE KEY',
  '4242 4242 4242 4242',
  '4111-1111-1111-1111',
  '378282246310005',
  'DE89 3704 0044 0532 0130 00',
  'GB82WEST12345698765432',
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7',
  'Zx9Qw3Er5Ty7Ui1Op2As4Df6Gh8Jk0LmNbVc',
]) {
  const got = found(`Value: ${secret} here`);
  assert.strictEqual(got.length, 1, `one secret in "${secret}", got ${JSON.stringify(got)}`);
  assert.ok(got[0].includes(secret.replace(/^-+|-+$/g, '')), `"${secret}" covered, got "${got[0]}"`);
}

// Not found: ordinary screen text
for (const text of [
  'Revenue is up 12% this month.',
  'Order #3042 · 24 Oct, 09:41 · €120.00',
  'Call +49 40 1234567 or visit https://example.com/docs/getting-started',
  '/Users/calvin/projects/ai-feedback-editor/src/components/settings',
  'src/components/UserProfileSettings/index.tsx',
  'src/components/UserProfile2Settings/index.tsx',
  'https://docs.google.com/document/d/1aBcD3fGh5IjK7lMn9OpQ2rStUvWxYz/edit',
  'commit 8968572c1f3e4b5a6d7e8f9012345678abcdef01',
  'a3f1c9e2-7b4d-4e8a-9f12-3c5d7e9a1b2f',
  'Version 2026.10.25-beta.3 (build 4521)',
  'Card 4242 4242 4242 4241', // fails Luhn
  'DE89 3704 0044 0532 0130 02', // fails mod 97 (and Luhn, as a card number)
  'risk-management-framework-overview',
  'The quick brown fox jumps over the lazy dog',
]) {
  assert.deepStrictEqual(found(text), [], `nothing in "${text}"`);
}

assert.ok(luhn('4242424242424242') && !luhn('4242424242424241') && !luhn('424242424242')); // too short
assert.ok(iban('DE89 3704 0044 0532 0130 00') && !iban('DE00 3704 0044 0532 0130 00'));
assert.ok(random('Zx9Qw3Er5Ty7Ui1Op2As4Df6Gh8Jk0LmNbVc') && !random('aaaaBBBB1111aaaaBBBB1111aaaaBBBB1111'));

// Two in one line, and overlapping patterns counted once
assert.deepStrictEqual(found('From jane@example.com to joe@example.org'), ['jane@example.com', 'joe@example.org']);
assert.deepStrictEqual(found('key=sk-proj-4f9aK2mQ7xL0pR8vB3nZ6wY1aBcDeFgHiJ'), ['key=sk-proj-4f9aK2mQ7xL0pR8vB3nZ6wY1aBcDeFgHiJ']);

// Boxes: the whole words a secret touches, padded, never past the top left
const line: OcrLine = {
  text: 'Card 4242 4242 4242 4242 mail:me@example.com',
  x: 10,
  y: 100,
  w: 600,
  h: 20,
  words: [
    { start: 0, end: 4, x: 10, y: 100, w: 50, h: 20 },
    { start: 5, end: 9, x: 70, y: 100, w: 50, h: 20 },
    { start: 10, end: 14, x: 130, y: 100, w: 50, h: 20 },
    { start: 15, end: 19, x: 190, y: 100, w: 50, h: 20 },
    { start: 20, end: 24, x: 250, y: 100, w: 50, h: 20 },
    { start: 25, end: 44, x: 310, y: 100, w: 300, h: 20 },
  ],
};
assert.deepStrictEqual(secretBoxes([line]), [
  { x: 67, y: 97, w: 236, h: 26 }, // the four groups of the card number, not "Card"
  { x: 307, y: 97, w: 306, h: 26 }, // the word the email is part of
]);
assert.deepStrictEqual(secretBoxes([{ ...line, text: 'nothing here', words: [] }]), []);
const corner = secretBoxes([{ text: 'a@b.de', x: 0, y: 1, w: 30, h: 10, words: [{ start: 0, end: 6, x: 0, y: 1, w: 30, h: 10 }] }]);
assert.deepStrictEqual(corner, [{ x: 0, y: 0, w: 32, h: 13 }]);

console.log('redact: ok');
