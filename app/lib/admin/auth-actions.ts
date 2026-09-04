"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import type { ActionState } from "./guard";

/**
 * Signs in, or says the credentials were wrong.
 *
 * One message for every failure — unknown username, wrong password, disabled
 * account — because saying which is which turns the form into a way of
 * enumerating who works here.
 */
export async function signInAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!username || !password)
    return { error: "Enter your username and password." };

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    // A successful sign-in *also* leaves through this catch, as the redirect
    // Next throws to navigate. Only an AuthError is an actual failure; the
    // rethrow below is what lets the redirect through.
    if (error instanceof AuthError)
      return { error: "That username and password do not match an account." };
    throw error;
  }

  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
