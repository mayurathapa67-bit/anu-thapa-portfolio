import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ToolsSection from "@/components/ToolsSection";
import { ServiceIcon, CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "About — Technical Writer",
  description:
    "Anu Thapa's writing philosophy, technical expertise, experience, certifications, and tooling proficiency.",
  alternates: { canonical: `${siteUrl}/about` },
};

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
            {about.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.image}
                alt="Anu Thapa, Technical Writer"
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-cream">
                <span className="font-playfair text-3xl text-charcoal/30">
                  {content.hero.title}
                </span>
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading eyebrow="About" title={about.headline} description={about.bio} />
          <p className="mt-6 border-l-2 border-teal pl-5 text-base leading-relaxed text-charcoal/70">
            {about.philosophy}
          </p>
        </Reveal>
      </div>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Expertise"
          title="Technical domains I write for"
          description="Specialised documentation across the product lifecycle."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {Array.isArray(about.expertise) &&
            about.expertise.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-5 rounded-2xl border border-charcoal/10 bg-white p-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                    <ServiceIcon name={item.icon} width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Experience"
          title="Professional timeline"
          description="A decade of documenting software for global teams."
        />
        <div className="mt-10 space-y-0">
          {Array.isArray(about.experience) &&
            about.experience.map((exp, i) => (
              <Reveal key={`${exp.company}-${i}`} delay={i * 0.05}>
                <div className="grid gap-2 border-l-2 border-charcoal/10 py-6 pl-8 sm:grid-cols-[180px_1fr]">
                  <span className="text-sm font-medium text-teal">
                    {exp.period}
                  </span>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-charcoal">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-charcoal/60">{exp.company}</p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Proficiency"
          title="Tools & technologies"
          description="Authoring, API tooling, and collaboration platforms I work with daily."
        />
        <div className="mt-10">
          <ToolsSection tools={about.tools} />
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          description="Continuous learning to stay sharp in the craft."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(about.certifications) &&
            about.certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={(i % 3) * 0.08}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-charcoal/10 bg-white p-6">
                  <CheckIcon
                    width={20}
                    height={20}
                    className="mt-0.5 shrink-0 text-teal"
                  />
                  <div>
                    <p className="font-medium text-charcoal">{cert.name}</p>
                    <p className="text-sm text-charcoal/60">
                      {cert.issuer} &middot; {cert.year}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
        </div>
      </section>
    </div>
  );
}
