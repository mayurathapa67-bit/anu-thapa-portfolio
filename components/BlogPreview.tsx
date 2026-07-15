import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import Reveal from "@/components/Reveal";
import { formatDate } from "@/lib/readTime";

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }
  const latest = posts.slice(0, 3);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {latest.map((post, i) => (
        <Reveal key={post.id} delay={i * 0.08}>
          <Link
            href="/blog"
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
              <p className="mt-4 text-xs text-charcoal/40">
                {formatDate(post.published_date)}
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
