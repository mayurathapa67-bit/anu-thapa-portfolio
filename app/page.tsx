import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import DocumentationCard from "@/components/DocumentationCard";
import ServicesGrid from "@/components/ServicesGrid";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BlogPreview from "@/components/BlogPreview";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { ArrowIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Technical Writer — Clarity Through Technical Writing",
  description:
    "Anu Thapa transforms complex information into clear, user-friendly documentation: API references, user manuals, and technical guides.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Anu Thapa — Technical Writer",
    description:
      "Clarity Through Technical Writing. API docs, user guides, and technical manuals.",
    url: siteUrl,
  },
};

export default async function HomePage() {
  const content = await getContent();
  const featured = Array.isArray(content.portfolio)
    ? content.portfolio.slice(0, 3)
    : [];
  const services = Array.isArray(content.services)
    ? content.services.slice(0, 3)
    : [];

  return (
    <>
      <Hero hero={content.hero} />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Featured Work"
            title="Documentation samples"
            description="A selection of recent documentation crafted for developers, enterprises, and end users."
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal transition-colors hover:text-charcoal"
          >
            View all samples
            <ArrowIcon width={16} height={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <DocumentationCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-cream">
              {content.about.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.about.image}
                  alt="Anu Thapa, Technical Writer"
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center">
                  <span className="font-playfair text-3xl text-charcoal/30">
                    {content.hero.title}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="About"
              title={content.about.headline}
              description={content.about.bio}
            />
            <p className="mt-6 border-l-2 border-teal pl-5 text-base leading-relaxed text-charcoal/70">
              {content.about.philosophy}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-teal"
            >
              Read my story
              <ArrowIcon width={16} height={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="Services"
          title="How I can help your team"
          description="From API references to documentation strategy, I deliver clear, scalable technical content."
        />
        <div className="mt-12">
          <ServicesGrid services={services} />
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal transition-colors hover:text-charcoal"
          >
            Explore all services
            <ArrowIcon width={16} height={16} />
          </Link>
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say"
            align="center"
          />
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-10">
          <TestimonialsCarousel testimonials={content.testimonials} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="From the Blog"
          title="Technical writing insights"
          description="Practical notes on documentation best practices, trends, and tooling."
        />
        <div className="mt-12">
          <BlogPreview posts={content.blog} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-charcoal px-8 py-16 text-center text-cream">
            <h2 className="font-playfair text-3xl font-semibold sm:text-4xl">
              Let&rsquo;s make your docs effortless to read.
            </h2>
            <p className="max-w-xl text-cream/70">
              Available for freelance documentation projects, retainers, and
              consulting engagements.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-8 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-charcoal"
            >
              Start a conversation
              <ArrowIcon width={16} height={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
