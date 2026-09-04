import type { Metadata } from "next";
import { PasswordForm } from "@/app/components/admin/password-form";
import { PageHeading } from "@/app/components/admin/ui";
import { requireUser } from "@/app/lib/admin/guard";
import { roleDescriptions, roleLabels } from "@/app/lib/auth/roles";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeading title="Your account" />

      <dl className="mb-8 grid max-w-[420px] gap-3 rounded-lg border border-ink/10 bg-white p-5 text-[13px]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink/55">Name</dt>
          <dd className="text-ink">{user.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/55">Username</dt>
          <dd className="text-ink">{user.username}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/55">Role</dt>
          <dd className="text-right text-ink">
            {roleLabels[user.role]}
            <span className="block text-[12px] text-ink/50">
              {roleDescriptions[user.role]}
            </span>
          </dd>
        </div>
      </dl>

      <h2 className="mb-3 text-[15px] font-semibold text-ink">
        Change your password
      </h2>
      <PasswordForm />
    </>
  );
}
