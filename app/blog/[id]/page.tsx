import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { formatDate } from "@/lib/readTime";
import { ArrowIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

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

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const content = await getContent();
  const post = (content.blog ?? []).find((b) => b.id === id);
  if (!post) {
    return {
      title: "Article not found",
      description: "The requested article could not be found.",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${post.id}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const content = await getContent();
  const post = (content.blog ?? []).find((b) => b.id === id);
  if (!post) {
    notFound();
  }

  const related = (content.blog ?? [])
    .filter((b) => b.id !== post.id)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal transition-colors hover:text-charcoal"
      >
        <ArrowIcon width={16} height={16} className="rotate-180" />
        Back to blog
      </Link>

      <div className="mt-8 flex items-center gap-3 text-xs text-charcoal/50">
        <span className="rounded-full bg-teal/10 px-2.5 py-1 font-medium text-teal">
          {post.category}
        </span>
        <span>{formatDate(post.published_date)}</span>
        <span>&middot;</span>
        <span>{post.read_time}</span>
      </div>

      <h1 className="mt-5 font-playfair text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
        {post.excerpt}
      </p>

      {post.featured_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featured_image}
          alt={post.title}
          className="mt-10 aspect-[16/9] w-full rounded-2xl border border-charcoal/10 object-cover"
        />
      )}

      <article className="prose-cream mt-10 space-y-4 text-base leading-relaxed text-charcoal/80">
        {renderArticle(post.content)}
      </article>

      {related.length > 0 && (
        <div className="mt-16 border-t border-charcoal/10 pt-10">
          <p className="font-playfair text-xl font-semibold text-charcoal">
            Keep reading
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.id}`}
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
