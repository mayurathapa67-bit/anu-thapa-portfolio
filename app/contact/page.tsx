import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Contact — Let's Work Together",
  description:
    "Get in touch with Anu Thapa for technical writing, API documentation, and content strategy engagements.",
  alternates: { canonical: `${siteUrl}/contact` },
};

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;

  const details = [
    { icon: MailIcon, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: PhoneIcon, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
    { icon: PinIcon, label: "Location", value: contact.location, href: "" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Let's make your documentation effortless"
          description="Tell me about your project, timeline, and goals. I typically respond within one business day."
        />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-6">
            {details.map((d) => {
              const Icon = d.icon;
              const inner = (
                <div className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-white p-6 transition-colors hover:border-teal/40">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                    <Icon width={22} height={22} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-charcoal/50">
                      {d.label}
                    </p>
                    <p className="mt-1 font-medium text-charcoal">{d.value}</p>
                  </div>
                </div>
              );
              return d.href ? (
                <a key={d.label} href={d.href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={d.label}>{inner}</div>
              );
            })}

            <div className="rounded-2xl border border-charcoal/10 bg-charcoal p-6 text-cream">
              <p className="text-xs uppercase tracking-widest text-cream/50">
                Find me online
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {Array.isArray(contact.socials) &&
                  contact.socials.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/80 transition-colors hover:border-teal hover:text-teal"
                    >
                      {s.platform}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-charcoal/10 bg-white p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
