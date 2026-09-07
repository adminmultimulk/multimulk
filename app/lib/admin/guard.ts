import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/db";
import {
  canEditArticles,
  canEditProperties,
  canManageUsers,
  isRole,
  type Role,
} from "@/app/lib/auth/roles";

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
  mustChangePassword: boolean;
};

/**
 * The signed-in person, read from the database rather than from the token.
 *
 * The session cookie is only trusted for *who* — the role, whether the account
 * is still enabled, and whether a password change is outstanding all come from
 * the row. A JWT is a snapshot: disabling an account or demoting someone would
 * otherwise leave them with their old access until their token expired, which
 * is exactly the window a revocation exists to close. One indexed lookup per
 * admin request is a fair price for that.
 */
export async function currentUser(): Promise<AdminUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      active: true,
      mustChangePassword: true,
    },
  });
  if (!user || !user.active || !isRole(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

/**
 * Signed in, or bounced to the sign-in form.
 *
 * Every admin page and every server action goes through one of these rather
 * than reading `auth()` directly. A layout guard alone is not enough: a server
 * action is a POST endpoint of its own and is reachable without ever rendering
 * the layout that would have turned the caller away.
 */
export async function requireUser(): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireArticleAccess(): Promise<AdminUser> {
  const user = await requireUser();
  if (!canEditArticles(user.role)) redirect("/admin");
  return user;
}

export async function requirePropertyAccess(): Promise<AdminUser> {
  const user = await requireUser();
  if (!canEditProperties(user.role)) redirect("/admin");
  return user;
}

/**
 * Anyone who edits something that carries a picture.
 *
 * Uploading is not a section of the dashboard of its own — it is a step in
 * writing an article or listing a unit — so the gate is the union of the two
 * rather than either one. An editor needs a banner as much as a lister needs
 * a card image, and holding the media library to `requirePropertyAccess`
 * would have left every writer typing paths by hand.
 */
export async function requireMediaAccess(): Promise<AdminUser> {
  const user = await requireUser();
  if (!canEditArticles(user.role) && !canEditProperties(user.role))
    redirect("/admin");
  return user;
}

export async function requireSuperadmin(): Promise<AdminUser> {
  const user = await requireUser();
  if (!canManageUsers(user.role)) redirect("/admin");
  return user;
}

/**
 * What a server action hands back to `useActionState`.
 *
 * `fieldErrors` is keyed by input name so a form can show each message beside
 * the field that caused it; `error` is for what is not one field's fault. An
 * action that redirects on success returns nothing at all.
 */
export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
};
