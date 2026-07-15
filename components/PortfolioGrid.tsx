"use client";

import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/types";
import DocumentationCard from "@/components/DocumentationCard";
import { SearchIcon } from "@/components/icons";

export default function PortfolioGrid({
  items,
}: {
  items: PortfolioItem[];
}) {
  const list = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items],
  );
  const categories = useMemo(() => {
    const set = new Set<string>();
    list.forEach((item) => set.add(item.category));
    return ["All", ...Array.from(set)];
  }, [list]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((item) => {
      const matchesCategory = active === "All" || item.category === active;
      const matchesQuery =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tech_stack.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [list, active, query]);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-charcoal text-cream"
                  : "border border-charcoal/15 text-charcoal/70 hover:border-teal hover:text-teal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <SearchIcon
            width={18}
            height={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full rounded-full border border-charcoal/15 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal outline-none transition-colors focus:border-teal"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-charcoal/50">
          No documentation samples match your search.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <DocumentationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
