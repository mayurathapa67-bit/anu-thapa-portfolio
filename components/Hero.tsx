"use client";

import { motion } from "framer-motion";
import type { Hero as HeroType } from "@/lib/types";
import MagneticButton from "@/components/MagneticButton";
import { ArrowIcon } from "@/components/icons";

export default function Hero({ hero }: { hero: HeroType }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal/5 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-teal"
          >
            {hero.role}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-playfair text-5xl font-semibold leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal/70"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              href={hero.cta_primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-teal"
            >
              {hero.cta_primary.label}
              <ArrowIcon
                width={16}
                height={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </MagneticButton>
            <MagneticButton
              href={hero.cta_secondary.href}
              strength={0.3}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-7 py-3.5 text-sm font-medium text-charcoal transition-colors hover:border-teal hover:text-teal"
            >
              {hero.cta_secondary.label}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/5">
            {hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.image}
                alt={`${hero.title} — Technical Writer`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-playfair text-3xl text-charcoal/30">
                  {hero.title}
                </span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-white p-5 shadow-xl sm:block">
            <p className="font-playfair text-3xl font-semibold text-teal">8+</p>
            <p className="text-xs uppercase tracking-widest text-charcoal/60">
              Years Writing
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
