import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/db";
import { SUPERADMIN_USERNAME } from "./roles";

/** Cost 12: ~250ms on the hardware this runs on, which is the point. */
export const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Makes sure the one constant account exists, and is called on every sign-in
 * attempt for `superadmin`.
 *
 * Seeding here rather than in a migration or a one-off script is deliberate:
 * there is no step between deploying and being able to sign in, and no window
 * where the database is up and nobody can reach the dashboard.
 *
 * `SUPERADMIN_PASSWORD` is the seed, not the password of record. Once the
 * account exists this function leaves its hash alone, so changing the password
 * from the dashboard sticks and rotating the env var does not silently undo
 * it. To reset a forgotten password, delete the row and sign in again.
 */
export async function ensureSuperadmin(): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { username: SUPERADMIN_USERNAME },
    select: { id: true },
  });
  if (existing) return;

  const seed = process.env.SUPERADMIN_PASSWORD;
  if (!seed) {
    // Not thrown: an unset variable must read as "wrong password" at the form,
    // not as a stack trace that tells an attacker the account is unclaimed.
    console.error(
      "SUPERADMIN_PASSWORD is not set — the superadmin account cannot be seeded.",
    );
    return;
  }

  await prisma.user.create({
    data: {
      username: SUPERADMIN_USERNAME,
      name: "Super admin",
      passwordHash: await hashPassword(seed),
      role: "SUPERADMIN",
      active: true,
    },
  });
}
