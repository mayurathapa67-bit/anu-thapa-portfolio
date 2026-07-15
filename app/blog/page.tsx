import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { formatDate } from "@/lib/readTime";
import { ArrowIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Blog — Technical Writing Insights",
  description:
    "Articles on technical writing best practices, documentation trends, and tools reviews by Anu Thapa.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default async function BlogPage() {
  const content = await getContent();
  const posts = content.blog ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Notes on technical writing"
          description="Best practices, trends, and honest tool reviews from the docs trenches."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={(i % 3) * 0.08}>
            <Link
              href={`/blog/${post.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-xl"
            >
              <div className="aspect-[16/9] overflow-hidden bg-charcoal/5">
                {post.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-charcoal/5">
                    <span className="font-playfair text-sm text-charcoal/30">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-charcoal/50">
                  <span className="rounded-full bg-teal/10 px-2.5 py-1 font-medium text-teal">
                    {post.category}
                  </span>
                  <span>{post.read_time}</span>
                </div>
                <h3 className="mt-3 font-playfair text-lg font-semibold leading-snug text-charcoal">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-charcoal/40">
                    {formatDate(post.published_date)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-teal">
                    Read
                    <ArrowIcon width={16} height={16} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
