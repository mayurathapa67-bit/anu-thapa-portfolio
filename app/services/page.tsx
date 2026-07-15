import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { ServiceIcon, CheckIcon, ArrowIcon } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Services — Documentation & Content",
  description:
    "API documentation, software documentation, user guides, technical editing, content strategy, and documentation audits with transparent pricing.",
  alternates: { canonical: `${siteUrl}/services` },
};

export default async function ServicesPage() {
  const content = await getContent();
  const services = content.services ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="Documentation, done right"
          description="Flexible engagements for teams that care about clarity. Fixed-rate tiers with no surprises."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={(i % 2) * 0.08}>
            <article className="flex h-full flex-col rounded-2xl border border-charcoal/10 bg-white p-8 transition-all duration-300 hover:border-teal/40 hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <ServiceIcon name={service.icon} width={26} height={26} />
                </div>
                {service.price && (
                  <span className="rounded-full bg-charcoal px-4 py-1.5 text-sm font-medium text-cream">
                    {service.price}
                  </span>
                )}
              </div>

              <h3 className="mt-6 font-playfair text-2xl font-semibold text-charcoal">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                {service.description}
              </p>

              {Array.isArray(service.features) && service.features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-charcoal/80"
                    >
                      <CheckIcon
                        width={18}
                        height={18}
                        className="mt-0.5 shrink-0 text-teal"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-charcoal/15 px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:border-teal hover:text-teal"
              >
                Request a quote
                <ArrowIcon width={16} height={16} />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
