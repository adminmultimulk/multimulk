"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { isRole, SUPERADMIN_USERNAME, assignableRoles } from "@/app/lib/auth/roles";
import { hashPassword, verifyPassword } from "@/app/lib/auth/superadmin";
import { requireSuperadmin, requireUser, type ActionState } from "./guard";
import { field } from "./validate";

/** Sign-in handles: lowercase, digits, dots, hyphens and underscores. */
const USERNAME = /^[a-z0-9](?:[a-z0-9._-]{1,30})[a-z0-9]$/;

/**
 * The floor a password has to clear.
 *
 * A length minimum and nothing else. Composition rules — a digit, a symbol,
 * a capital — reliably produce `Password1!` and nothing better, and this
 * dashboard is reached by a handful of named people, not the open internet.
 */
const MIN_PASSWORD = 12;

function checkPassword(value: string, confirm: string): string | null {
  if (value.length < MIN_PASSWORD)
    return `Use at least ${MIN_PASSWORD} characters.`;
  if (value !== confirm) return "The two passwords do not match.";
  return null;
}

/**
 * Creates an account. Superadmin only, which is the whole access model: nobody
 * signs themselves up, and there is no invitation link to leak.
 */
export async function createUser(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireSuperadmin();

  const username = field(form, "username").toLowerCase();
  const name = field(form, "name");
  const email = field(form, "email");
  const role = field(form, "role");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "A name is required — it is what bylines show.";
  if (!USERNAME.test(username))
    fieldErrors.username =
      "3–32 characters: lowercase letters, digits, dots, hyphens and underscores.";
  else if (username === SUPERADMIN_USERNAME)
    fieldErrors.username = "That username is reserved.";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    fieldErrors.email = "That is not an email address.";
  if (!isRole(role) || !assignableRoles.includes(role))
    fieldErrors.role = "Pick a role.";

  const passwordError = checkPassword(password, confirm);
  if (passwordError) fieldErrors.password = passwordError;

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  try {
    await prisma.user.create({
      data: {
        username,
        name,
        email: email || null,
        role: role as "EDITOR" | "LISTER",
        passwordHash: await hashPassword(password),
        // They pick their own on first sign-in; the one set here was typed by
        // someone else and has already travelled to them over some channel.
        mustChangePassword: true,
        createdById: admin.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return { fieldErrors: { username: "That username is taken." } };
    console.error("Could not create user:", error);
    return { error: "The database refused the change. No account was created." };
  }

  revalidatePath("/admin/users");
  return { success: `${name} can now sign in as ${username}.` };
}

/**
 * Turns an account off, or back on.
 *
 * Not a delete: articles and listings carry their author, and removing the row
 * would either orphan them or take them with it. A disabled account is refused
 * at sign-in and keeps its byline.
 */
export async function setUserActive(id: string, active: boolean): Promise<void> {
  const admin = await requireSuperadmin();
  if (id === admin.id) throw new Error("You cannot disable your own account.");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { username: true },
  });
  if (!user) return;
  if (user.username === SUPERADMIN_USERNAME)
    throw new Error("The superadmin account cannot be disabled.");

  await prisma.user.update({ where: { id }, data: { active } });
  revalidatePath("/admin/users");
}

/** Changes what someone may reach. The superadmin's own role is fixed. */
export async function setUserRole(id: string, role: string): Promise<void> {
  await requireSuperadmin();
  if (!isRole(role) || !assignableRoles.includes(role))
    throw new Error("Not a role that can be assigned.");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { username: true },
  });
  if (!user) return;
  if (user.username === SUPERADMIN_USERNAME)
    throw new Error("The superadmin's role cannot be changed.");

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

/**
 * Sets someone else's password, for the one case a self-service reset cannot
 * cover: they have forgotten it and there is no email flow.
 */
export async function resetUserPassword(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSuperadmin();

  const id = field(form, "id");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const passwordError = checkPassword(password, confirm);
  if (passwordError) return { fieldErrors: { password: passwordError } };

  const user = await prisma.user.findUnique({
    where: { id },
    select: { username: true, name: true },
  });
  if (!user) return { error: "That account no longer exists." };

  await prisma.user.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    },
  });

  revalidatePath("/admin/users");
  return { success: `${user.name} will be asked to choose a new password.` };
}

/**
 * Changes your own password.
 *
 * The current password is required even though you are already signed in —
 * that is what stops a borrowed, unlocked laptop from becoming a permanent
 * takeover of the account.
 */
export async function changeOwnPassword(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const me = await requireUser();

  const current = String(form.get("current") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user) return { error: "That account no longer exists." };

  if (!(await verifyPassword(current, user.passwordHash)))
    return { fieldErrors: { current: "That is not your current password." } };

  const passwordError = checkPassword(password, confirm);
  if (passwordError) return { fieldErrors: { password: passwordError } };

  if (await verifyPassword(password, user.passwordHash))
    return { fieldErrors: { password: "That is the password you already have." } };

  await prisma.user.update({
    where: { id: me.id },
    data: {
      passwordHash: await hashPassword(password),
      mustChangePassword: false,
    },
  });

  revalidatePath("/admin", "layout");
  return { success: "Your password has been changed." };
}
