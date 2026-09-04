import type { Metadata } from "next";
import { ActionButton } from "@/app/components/admin/action-button";
import { PageHeading } from "@/app/components/admin/ui";
import {
  CreateUserForm,
  ResetPasswordForm,
  RoleSelect,
} from "@/app/components/admin/user-forms";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import { setUserActive, setUserRole } from "@/app/lib/admin/user-actions";
import { SUPERADMIN_USERNAME, roleLabels } from "@/app/lib/auth/roles";
import { prisma } from "@/app/lib/db";

export const metadata: Metadata = { title: "People" };

export default async function UsersPage() {
  const admin = await requireSuperadmin();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      active: true,
      mustChangePassword: true,
      lastLoginAt: true,
      _count: { select: { articles: true, properties: true } },
    },
  });

  return (
    <>
      <PageHeading
        title="People"
        description="Only you can create an account. There is no sign-up, no invitation link, and no password reset by email — a forgotten password is set here."
      />

      <section className="mb-8 rounded-lg border border-ink/10 bg-white p-5">
        <h2 className="mb-4 text-[15px] font-semibold text-ink">
          Create an account
        </h2>
        <CreateUserForm />
      </section>

      <h2 className="mb-3 text-[15px] font-semibold text-ink">Accounts</h2>
      <div className="grid gap-3">
        {users.map((user) => {
          const fixed = user.username === SUPERADMIN_USERNAME;
          return (
            <article
              key={user.id}
              className="rounded-lg border border-ink/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-ink">
                    {user.name}
                    {!user.active ? (
                      <span className="ml-2 rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] text-ink/60 uppercase">
                        Disabled
                      </span>
                    ) : null}
                    {user.mustChangePassword ? (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] text-amber-800 uppercase">
                        Password not set
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-ink/55">
                    {user.username}
                    {user.email ? ` · ${user.email}` : ""} ·{" "}
                    {user._count.articles} article
                    {user._count.articles === 1 ? "" : "s"} ·{" "}
                    {user._count.properties} listing
                    {user._count.properties === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink/45">
                    {user.lastLoginAt
                      ? `Last signed in ${user.lastLoginAt.toISOString().slice(0, 10)}`
                      : "Has never signed in"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {fixed ? (
                    <span className="rounded-md border border-ink/15 px-3 py-2 text-[13px] text-ink/60">
                      {roleLabels.SUPERADMIN} · fixed
                    </span>
                  ) : (
                    <>
                      <RoleSelect
                        id={user.id}
                        role={user.role}
                        onChange={setUserRole}
                      />
                      {user.id === admin.id ? null : (
                        <ActionButton
                          action={setUserActive.bind(null, user.id, !user.active)}
                          label={user.active ? "Disable" : "Enable"}
                          busyLabel="Saving…"
                          confirmLabel={user.active ? "Disable access" : undefined}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              {fixed && user.id !== admin.id ? null : fixed ? null : (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <ResetPasswordForm id={user.id} name={user.name} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
