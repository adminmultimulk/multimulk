/**
 * Proves the Bitrix24 webhook works before an enquirer finds out it does not.
 *
 * The failures worth catching here — a token pasted with a character missing,
 * a webhook created without `crm` scope, a portal in simple CRM mode that has
 * leads switched off — all look identical from the form: the reader is told
 * their enquiry failed and nobody learns why until someone reads the logs. The
 * only other way to test is to submit the real form, which puts a junk lead in
 * front of the sales team.
 *
 * `profile` is the probe because it needs no scope at all: it separates "the
 * URL and token are wrong" from "the token is fine but cannot touch the CRM",
 * which are different fixes on different Bitrix screens.
 *
 *   node --env-file=.env.local scripts/check-bitrix.mjs          connection only
 *   node --env-file=.env.local scripts/check-bitrix.mjs --lead   also create a real test lead
 *
 * `--lead` writes to the live CRM. It prints the id so it can be deleted again.
 */

const base = process.env.BITRIX24_WEBHOOK_URL;

if (!base) {
  console.error(
    "BITRIX24_WEBHOOK_URL is not set.\n" +
      "Pass an env file: node --env-file=.env.local scripts/check-bitrix.mjs",
  );
  process.exit(1);
}

/** Kept in step with `endpointFor` in app/lib/leads/bitrix24.ts. */
function endpointFor(url, method) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (!segments.includes("rest")) {
    throw new Error(
      "no /rest/ path segment — that is the portal address, not an inbound webhook",
    );
  }
  if (segments[segments.length - 1]?.includes(".")) segments.pop();
  parsed.search = "";
  parsed.hash = "";
  parsed.pathname = `/${[...segments, `${method}.json`].join("/")}`;
  return parsed.toString();
}

async function call(method, payload = {}) {
  const response = await fetch(endpointFor(base, method), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json().catch(() => null);
  if (body && typeof body === "object" && "error" in body) {
    const failure = new Error(body.error_description || String(body.error));
    failure.code = String(body.error ?? "");
    throw failure;
  }
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return body?.result;
}

// The portal host is safe to print; the token in the path is not.
console.log(`Portal: ${new URL(base).host}\n`);

console.log("Checking the webhook…");
let profile;
try {
  profile = await call("profile");
} catch (error) {
  console.error(`  failed: ${error.message}`);
  console.error(
    "\nThe URL or its token is wrong. Take it again from Bitrix24:\n" +
      "  Developer resources → Other → Inbound webhook",
  );
  process.exit(1);
}
console.log(
  `  authenticated as ${profile.NAME ?? ""} ${profile.LAST_NAME ?? ""}`.trimEnd() +
    ` (id ${profile.ID}).`,
);
console.log("  every lead will be owned by this user unless");
console.log("  BITRIX24_ASSIGNED_BY_ID names someone else.\n");

console.log("Checking CRM access…");
try {
  await call("crm.lead.fields");
} catch (error) {
  console.error(`  failed: ${error.message}`);
  console.error(
    "\nThe webhook authenticates but cannot reach leads. Either it was\n" +
      "created without the `crm` scope — edit it and tick CRM — or the portal\n" +
      "runs simple CRM mode, which has leads switched off entirely\n" +
      "(CRM → Settings → CRM modes → Classic).",
  );
  process.exit(1);
}
console.log("  crm scope present and leads are enabled.\n");

const assignee = process.env.BITRIX24_ASSIGNED_BY_ID;
if (assignee) {
  console.log(`Checking BITRIX24_ASSIGNED_BY_ID=${assignee}…`);
  try {
    const [user] = await call("user.get", { ID: assignee });
    if (!user) throw new Error("no such user on this portal");
    console.log(
      `  leads will be assigned to ${user.NAME ?? ""} ${user.LAST_NAME ?? ""}`.trimEnd() +
        ".\n",
    );
  } catch (error) {
    // Reading the directory needs the `user` scope, which a webhook created
    // for `crm` alone does not have. That is not a problem with the setting:
    // ASSIGNED_BY_ID is passed straight to `crm.lead.add`, which only needs
    // `crm`, so assignment still works — the id simply cannot be confirmed
    // from here. Saying otherwise would send somebody to fix what is not
    // broken, and widening the token's scope to check one number is a worse
    // trade than looking the id up in the portal once.
    const unverifiable =
      error.code === "insufficient_scope" ||
      /higher privileges|access denied/i.test(error.message);

    if (unverifiable) {
      console.log("  cannot confirm the name: the webhook has no `user` scope.");
      console.log("  assignment still works — check the id against the number in");
      console.log("  the person's profile URL, /company/personal/user/<id>/.\n");
    } else {
      // A real one: the id names nobody, so Bitrix ignores it and quietly
      // falls back to the webhook's own user. Nothing errors and the leads
      // pile up on the wrong desk — the failure this script exists to catch.
      console.error(`  warning: ${error.message}`);
      console.error("  leads would fall back to the webhook's own user.\n");
      process.exitCode = 1;
    }
  }
}

if (!process.argv.includes("--lead")) {
  console.log("Connection is good. Re-run with --lead to create a test lead.");
  process.exit(process.exitCode ?? 0);
}

console.log("Creating a test lead…");
const id = await call("crm.lead.add", {
  fields: {
    TITLE: "[test] Multi Mulk website connection check",
    NAME: "Connection Test",
    COMMENTS:
      "Created by scripts/check-bitrix.mjs to verify the website integration. Safe to delete.",
    SOURCE_ID: process.env.BITRIX24_SOURCE_ID ?? "WEB",
    SOURCE_DESCRIPTION: "scripts/check-bitrix.mjs",
    OPENED: "Y",
    EMAIL: [{ VALUE: "test@example.com", VALUE_TYPE: "WORK" }],
    PHONE: [{ VALUE: "+900000000000", VALUE_TYPE: "WORK" }],
    ...(assignee ? { ASSIGNED_BY_ID: assignee } : {}),
  },
  params: { REGISTER_SONET_EVENT: "Y" },
});

// An absolute path, so this resolves against the portal origin and leaves the
// token behind — the link is safe to paste to a colleague.
console.log(`  created lead ${id}:`);
console.log(`  ${new URL(`/crm/lead/details/${id}/`, base).toString()}`);
console.log(
  "\nOpen it to confirm the name, phone, email and comments all arrived,\n" +
    "then delete it from that page. The website sends exactly these fields.",
);
