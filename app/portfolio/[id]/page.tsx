import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { formatDate } from "@/lib/readTime";
import { ArrowIcon, DownloadIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

type Params = { id: string };

function renderArticle(body: string): ReactNode[] {
  const blocks = body.split("\n\n");
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-10 font-playfair text-2xl font-semibold text-charcoal"
        >
          {trimmed.replace(/^##\s*/, "")}
        </h2>
      );
    }
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="mt-4 space-y-2">
          {lines.map((l, j) => (
            <li key={j} className="flex items-start gap-3 text-charcoal/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span>{l.replace(/^-\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-4 leading-relaxed text-charcoal/80">
        {block.trim()}
      </p>
    );
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const content = await getContent();
  const item = (content.portfolio ?? []).find((p) => p.id === id);
  if (!item) {
    return {
      title: "Writing sample not found",
      description: "The requested writing sample could not be found.",
    };
  }
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `${siteUrl}/portfolio/${item.id}` },
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      url: `${siteUrl}/portfolio/${item.id}`,
      images: item.featured_image ? [item.featured_image] : undefined,
    },
  };
}

export default async function PortfolioSamplePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const content = await getContent();
  const item = (content.portfolio ?? []).find((p) => p.id === id);
  if (!item) {
    notFound();
  }

  const related = (content.portfolio ?? [])
    .filter((p) => p.id !== item.id)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-28">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal transition-colors hover:text-charcoal"
      >
        <ArrowIcon width={16} height={16} className="rotate-180" />
        Back to portfolio
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-charcoal/50">
        <span className="rounded-full bg-teal/10 px-2.5 py-1 font-medium text-teal">
          {item.category}
        </span>
        <span>{formatDate(item.published_date)}</span>
        <span>&middot;</span>
        <span>{item.read_time}</span>
        {item.client ? (
          <>
            <span>&middot;</span>
            <span>{item.client}</span>
          </>
        ) : null}
      </div>

      <h1 className="mt-5 font-playfair text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
        {item.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
        {item.description}
      </p>

      {item.featured_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.featured_image}
          alt={item.title}
          className="mt-10 aspect-[16/9] w-full rounded-2xl border border-charcoal/10 object-cover"
        />
      )}

      {Array.isArray(item.tech_stack) && item.tech_stack.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {item.tech_stack.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-teal/10 px-3 py-1.5 text-sm font-medium text-teal"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-2 text-base leading-relaxed text-charcoal/80">
        {item.content ? renderArticle(item.content) : null}
      </div>

      {item.download_link && (
        <div className="mt-10">
          <a
            href={item.download_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-teal"
          >
            <DownloadIcon width={18} height={18} />
            Download documentation
          </a>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-charcoal/10 pt-10">
          <p className="font-playfair text-xl font-semibold text-charcoal">
            More writing samples
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/portfolio/${r.id}`}
                className="rounded-2xl border border-charcoal/10 bg-white p-6 transition-colors hover:border-teal/40"
              >
                <p className="text-xs text-charcoal/50">{r.category}</p>
                <h3 className="mt-2 font-playfair text-lg font-semibold text-charcoal">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
