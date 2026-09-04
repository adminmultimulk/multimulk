/**
 * A signed timestamp carried through the form.
 *
 * It gives the Server Action one thing it cannot otherwise know: how long the
 * form was on screen before it came back. A submission three seconds after
 * render was not typed by a person, and one that arrives two hours later is a
 * replay or a tab left open over lunch. Signing the timestamp is what stops a
 * bot simply sending `Date.now()`.
 */

import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = process.env.LEAD_SECRET;

/** Below this, nobody read the form. */
const MIN_AGE_MS = 3_000;
/** Above this, the token is stale — re-render rather than accept it. */
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function sign(issuedAt: string): string {
  return createHmac("sha256", secret!).update(issuedAt).digest("base64url");
}

/**
 * Mints a token for a form about to be rendered. Called from the Server
 * Component that renders the form, never from the client.
 *
 * With no `LEAD_SECRET` configured this returns an empty string and
 * verification is skipped. That is deliberate: an unset secret must degrade to
 * "one fewer spam check", never to "every real enquiry is rejected". The
 * honeypot and the rate limit are unaffected.
 */
export function mintFormToken(): string {
  if (!secret) return "";
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt)}`;
}

export type TokenVerdict = "ok" | "too-fast" | "stale" | "bad";

export function verifyFormToken(token: unknown): TokenVerdict {
  if (!secret) return "ok";
  if (typeof token !== "string" || !token.includes(".")) return "bad";

  const [issuedAt, mac] = token.split(".", 2);
  if (!/^\d+$/.test(issuedAt)) return "bad";

  const expected = sign(issuedAt);
  // Both are base64url of a SHA-256 digest, so they are the same length
  // whenever the input is well-formed; the length guard keeps
  // `timingSafeEqual` from throwing on a malformed one.
  if (mac.length !== expected.length) return "bad";
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return "bad";

  const age = Date.now() - Number(issuedAt);
  if (age < MIN_AGE_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "stale";
  return "ok";
}
