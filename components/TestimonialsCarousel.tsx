"use client";

import { motion } from "framer-motion";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return null;
  }

  const items = testimonials.length > 1 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex gap-6"
        animate={testimonials.length > 1 ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={{
          duration: testimonials.length > 1 ? 28 : 0,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((t, i) => (
          <figure
            key={`${t.name}-${i}`}
            className="flex w-[340px] shrink-0 flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-7"
          >
            <blockquote className="text-sm leading-relaxed text-charcoal/80">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10 font-playfair text-sm font-semibold text-teal">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                <p className="text-xs text-charcoal/50">
                  {t.role}, {t.company}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  );
}
