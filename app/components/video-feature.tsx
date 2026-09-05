import { Container, SectionIntro } from "./container";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The film shown at IPS Dubai, on the home page.
 *
 * Dark, between two light sections, so it reads as a break in the page rather
 * than another band of content — a video wants to be looked at rather than
 * scrolled past.
 *
 * `youtube-nocookie.com` is the privacy-preserving host: no advertising cookie
 * is set until playback begins, and because the dialog does not mount the
 * iframe until it opens, a reader who never presses play is never seen by
 * Google at all.
 *
 * The id is a constant rather than a prop because there is one film and the
 * home page is the one place it plays. When there is a second, this becomes an
 * argument and the copy moves with it.
 */
const VIDEO_ID = "m9c7ivx6LS0";
const POSTER = "/images/ips-dubai-2026-poster.webp";

export async function VideoFeature() {
  const t = await getDictionary();

  return (
    <section className="bg-forest py-[72px] lg:py-[112px]">
      <Container>
        <SectionIntro
          eyebrow={t.video.eyebrow}
          heading={t.video.heading}
          tone="dark"
        />
        <div className="mt-12 lg:mt-16">
          <HeroVideoDialog
            // `autoplay=1` is honoured because opening the dialog is itself
            // the user gesture browsers require; the film starts on the press
            // rather than asking for a second one.
            videoSrc={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
            thumbnailSrc={POSTER}
            title={t.video.heading}
            playLabel={t.video.play}
            closeLabel={t.common.close}
            // Full-bleed to the 1440px canvas less its gutters, and the whole
            // viewport below that; without this Next assumes 100vw and ships a
            // needlessly large file to desktop.
            sizes="(min-width: 1440px) 1296px, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
