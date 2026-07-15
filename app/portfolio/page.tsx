import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PortfolioGrid from "@/components/PortfolioGrid";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Portfolio — Writing Samples",
  description:
    "Filterable writing samples: API documentation, user guides, technical manuals, release notes, and knowledge base articles.",
  alternates: { canonical: `${siteUrl}/portfolio` },
};

export default async function PortfolioPage() {
  const content = await getContent();
  const items = content.portfolio ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Portfolio"
          title="Writing samples"
          description="Browse documentation across categories. Filter by type or search by topic and tech stack."
        />
      </Reveal>
      <div className="mt-12">
        <PortfolioGrid items={items} />
      </div>
    </div>
  );
}
