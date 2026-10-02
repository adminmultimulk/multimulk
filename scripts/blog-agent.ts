/**
 * Today's blog post, by hand. The daily one is written by the Vercel Cron at
 * /api/cron/blog-agent; this is the same run, for testing and for a day the
 * cron missed.
 *
 *   npm run blog:agent                 write it, publish it at today's slot
 *   npm run blog:agent -- --dry-run    write it, print it, publish nothing
 *   npm run blog:agent -- --now        publish the moment it is written
 *   npm run blog:agent -- --force      write another even if today has one
 *
 * `--conditions=react-server` in the npm script is what lets this import
 * modules guarded by `server-only`, which is what they are: this is a server.
 */

import { prisma } from "@/app/lib/db";
import { runDailyPost } from "@/app/lib/blog-agent/run";

const flags = new Set(process.argv.slice(2));

async function main() {
  const result = await runDailyPost({
    now: flags.has("--now"),
    force: flags.has("--force"),
    dryRun: flags.has("--dry-run"),
  });

  if (result.status === "dry-run") {
    const { draft } = result;
    console.log(`\n# ${draft.title}\n\n_${draft.excerpt}_\n`);
    console.log(`slug: ${draft.slug} · ${draft.category} · ${draft.topics.join(", ")}`);
    console.log(`cover: ${draft.cover.photo.full}\n`);
    console.log(draft.body.join("\n\n"));
    console.log(`\nSources:\n${draft.sources.map((s) => `- ${s.title}: ${s.url}`).join("\n")}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
