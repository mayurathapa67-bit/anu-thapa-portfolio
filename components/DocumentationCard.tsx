import Link from "next/link";
import type { PortfolioItem } from "@/lib/types";
import { DownloadIcon, ArrowIcon } from "@/components/icons";

export default function DocumentationCard({
  item,
}: {
  item: PortfolioItem;
}) {
  const href = `/portfolio/${item.id}`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-charcoal/5">
        {item.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.featured_image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-charcoal/5">
            <span className="font-playfair text-xl text-charcoal/30">
              {item.category}
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-charcoal/90 px-3 py-1 text-xs font-medium text-cream">
          {item.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-charcoal/50">
          <span>{item.published_date}</span>
          <span>&middot;</span>
          <span>{item.read_time}</span>
        </div>

        <h3 className="mt-3 font-playfair text-xl font-semibold text-charcoal">
          <Link href={href} className="transition-colors hover:text-teal">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
          {item.description}
        </p>

        {Array.isArray(item.tech_stack) && item.tech_stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tech_stack.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-charcoal/10 pt-4">
          {item.download_link ? (
            <a
              href={item.download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-charcoal transition-colors hover:text-teal"
            >
              <DownloadIcon width={16} height={16} />
              Download
            </a>
          ) : (
            <span className="text-sm text-charcoal/40">Preview only</span>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-teal transition-colors hover:text-charcoal"
          >
            View
            <ArrowIcon width={16} height={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
