import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginForm } from "@/app/components/admin/login-form";
import { currentUser } from "@/app/lib/admin/guard";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Already signed in — the form would only be a way to sign in twice.
  if (await currentUser()) redirect("/admin");

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 text-center">
          <p className="text-[11px] font-medium tracking-[0.18em] text-forest uppercase">
            Multi Mulk
          </p>
          <h1 className="mt-1.5 text-[24px] font-semibold tracking-[-0.01em] text-ink">
            Dashboard
          </h1>
          <p className="mt-2 text-[13px] leading-[20px] text-ink/55">
            Accounts are created by the super admin. There is no sign-up.
          </p>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-[0_1px_2px_rgba(34,42,44,0.06)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
