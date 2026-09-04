/**
 * Who can do what.
 *
 * Deliberately free of `server-only`, Prisma and Auth.js: the admin nav is a
 * client component and needs the same answers the server actions enforce, and
 * duplicating the rules in two places is how they drift apart.
 */

export const roles = ["SUPERADMIN", "EDITOR", "LISTER"] as const;

export type Role = (typeof roles)[number];

/**
 * The one account that cannot be created, renamed or deleted through the UI.
 * It is seeded from `SUPERADMIN_PASSWORD` — see `superadmin.ts`.
 */
export const SUPERADMIN_USERNAME = "superadmin";

export const roleLabels: Record<Role, string> = {
  SUPERADMIN: "Super admin",
  EDITOR: "Blog writer / editor",
  LISTER: "Property lister",
};

export const roleDescriptions: Record<Role, string> = {
  SUPERADMIN: "Full access, and the only role that can create accounts.",
  EDITOR: "Writes and publishes Knowledge Centre articles.",
  LISTER: "Creates and publishes property listings.",
};

/** The roles a superadmin may hand out. Never SUPERADMIN — there is only one. */
export const assignableRoles: Role[] = ["EDITOR", "LISTER"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (roles as readonly string[]).includes(value);
}

export function canEditArticles(role: Role | undefined): boolean {
  return role === "SUPERADMIN" || role === "EDITOR";
}

export function canEditProperties(role: Role | undefined): boolean {
  return role === "SUPERADMIN" || role === "LISTER";
}

export function canManageUsers(role: Role | undefined): boolean {
  return role === "SUPERADMIN";
}
