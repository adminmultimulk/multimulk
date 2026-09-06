/**
 * The Resend transport, on its own.
 *
 * Two things send email now — an enquiry to the sales inbox, and a visit
 * reminder to a visitor — and they share nothing except the wire. Extracting
 * that here keeps the second from copying the first's fetch, its timeout, and
 * the one detail that is easy to get wrong: reading the response body on a
 * failure, because a 403 for an unverified sending domain is only diagnosable
 * from what Resend writes in it.
 *
 * The REST API rather than the `resend` package, for the reason the rest of
 * this codebase posts its own JSON: the surface used here is one POST.
 */

import "server-only";

const ENDPOINT = "https://api.resend.com/emails";

/** Set by the Resend integration on Vercel; keep the name it injects. */
export const resendApiKey = process.env.RESEND_API_KEY;

/**
 * The sender, on a domain verified in Resend. Resend rejects anything else,
 * which is why this can never fall back to an address supplied at runtime.
 */
export const resendSender = process.env.LEAD_EMAIL_FROM;

/** Enough to send at all. A caller may still need recipients of its own. */
export const resendConfigured = Boolean(resendApiKey && resendSender);

export class ResendError extends Error {
  /** The HTTP status, when there was a response at all. */
  readonly status?: number;

  constructor(message: string, options?: { cause?: unknown; status?: number }) {
    super(message, options);
    this.name = "ResendError";
    this.status = options?.status;
  }
}

export type ResendMessage = {
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  /** Makes the attempt safely retryable — Resend replays its own response. */
  idempotencyKey?: string;
  /** Overrides the verified sender; must also be on a verified domain. */
  from?: string;
};

/**
 * One POST. Resolves with Resend's message id once it has accepted the message,
 * and throws otherwise — never a boolean, because every caller here has to
 * record *why* a send failed rather than only that it did.
 */
export async function sendResendEmail(
  message: ResendMessage,
): Promise<string | null> {
  const from = message.from ?? resendSender;
  if (!resendApiKey || !from) {
    throw new ResendError(
      "Resend is not configured — set RESEND_API_KEY and LEAD_EMAIL_FROM.",
    );
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${resendApiKey}`,
        ...(message.idempotencyKey
          ? { "Idempotency-Key": message.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from,
        to: message.to,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      // Small message; if Resend cannot answer promptly the caller is better
      // off recording a failure than holding a request open.
      signal: AbortSignal.timeout(8000),
    });
  } catch (cause) {
    throw new ResendError("Resend did not respond.", { cause });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new ResendError(
      `Resend returned ${response.status} ${response.statusText}. ${detail}`.trim(),
      { status: response.status },
    );
  }

  const body = (await response.json().catch(() => null)) as { id?: string } | null;
  return body?.id ?? null;
}
