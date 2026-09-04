import Link from "next/link";
import { AdminNav, type NavItem } from "@/app/components/admin/nav";
import { PasswordForm } from "@/app/components/admin/password-form";
import { signOutAction } from "@/app/lib/admin/auth-actions";
import { requireUser } from "@/app/lib/admin/guard";
import {
  canEditArticles,
  canEditProperties,
  canManageUsers,
  roleLabels,
} from "@/app/lib/auth/roles";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await requireUser();

  /*
   * An account whose password was typed by somebody else gets one screen and
   * no navigation until that is fixed. Rendering the gate in place of the
   * children — rather than redirecting to the account page — is what makes it
   * airtight: a layout cannot read the current path, so a redirect here would
   * either loop on the account page or need a hole punched in it.
   */
  if (user.mustChangePassword) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[560px] flex-col justify-center px-6 py-12">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">
          Choose your own password
        </h1>
        <p className="mt-2 mb-6 text-[13px] leading-[20px] text-ink/60">
          This account is still using the password the super admin set for it.
          Pick your own before going any further.
        </p>
        <PasswordForm submitLabel="Set password and continue" />
      </main>
    );
  }

  const items: NavItem[] = [
    { href: "/admin", label: "Overview", hint: "What is live, and what is waiting" },
  ];
  if (canEditArticles(user.role))
    items.push({
      href: "/admin/articles",
      label: "Articles",
      hint: "Knowledge Centre",
    });
  if (canEditProperties(user.role))
    items.push({
      href: "/admin/properties",
      label: "Properties",
      hint: "Listings and availability",
    });
  if (canManageUsers(user.role))
    items.push({ href: "/admin/users", label: "People", hint: "Accounts and access" });
  items.push({ href: "/admin/account", label: "Account", hint: "Your password" });

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1280px] flex-col lg:flex-row">
      <aside className="shrink-0 border-b border-ink/10 bg-white px-4 py-5 lg:w-[248px] lg:border-r lg:border-b-0">
        <div className="mb-5 px-3">
          <Link href="/admin" className="block">
            <span className="block text-[11px] font-medium tracking-[0.18em] text-forest uppercase">
              Multi Mulk
            </span>
            <span className="block text-[15px] font-semibold text-ink">
              Dashboard
            </span>
          </Link>
        </div>

        <AdminNav items={items} />

        <div className="mt-6 border-t border-ink/10 px-3 pt-4">
          <p className="text-[13px] font-medium text-ink">{user.name}</p>
          <p className="text-[11px] text-ink/50">{roleLabels[user.role]}</p>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-7 lg:px-9 lg:py-9">{children}</main>
    </div>
  );
}
