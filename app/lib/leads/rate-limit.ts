/**
 * A small fixed-window rate limit, keyed by client IP.
 *
 * In-memory on purpose. At this volume a shared store would be more moving
 * parts than the problem deserves, and the failure mode of per-instance
 * counters is generous rather than wrong: a burst spread across instances gets
 * a higher effective ceiling, which costs nothing, where a shared store that is
 * down would cost real enquiries. Swap in Redis alongside the durable lead sink
 * if that ever changes.
 */

import "server-only";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Bounds memory if a spray of spoofed IPs arrives before a window rolls. */
const MAX_TRACKED_KEYS = 10_000;

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function withinRateLimit(key: string): boolean {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) sweep(now);
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  existing.count += 1;
  return existing.count <= MAX_PER_WINDOW;
}
