/**
 * Simple owner PIN verification.
 * Set OWNER_PIN in your Vercel environment variables.
 * Default PIN for local dev: 1234 (change immediately after deploy!)
 */
export function verifyOwnerPin(pin: string): boolean {
  const ownerPin = process.env.OWNER_PIN ?? '1234';
  return pin === ownerPin;
}
