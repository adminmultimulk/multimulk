import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { welcome } from "@/app/lib/content";

export function Welcome() {
  return (
    <section className="bg-white py-[72px] lg:py-[112px]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[612px_1fr] lg:gap-[172px]">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
              {welcome.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-[32px] leading-[1.3] text-ink sm:text-[43px] sm:leading-[56px]">
              <AnimatedTitle variant="section">{welcome.heading}</AnimatedTitle>
            </h2>
          </div>
          <p className="max-w-[512px] text-[14px] leading-[23px] text-ink">
            {welcome.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
