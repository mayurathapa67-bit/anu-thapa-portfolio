"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Nav, NavLink } from "@/lib/types";
import { MenuIcon, CloseIcon } from "@/components/icons";

const FALLBACK_NAV: Nav = {
  logo: "Anu Thapa",
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Navbar({ nav }: { nav?: Nav }) {
  const active = nav && nav.links && nav.links.length > 0 ? nav : FALLBACK_NAV;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-playfair text-xl font-semibold tracking-tight text-charcoal"
        >
          {active.logo}
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {active.links.map((link: NavLink) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-teal"
                      : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-teal"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-teal md:inline-block"
        >
          Hire Me
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-charcoal md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-charcoal/10 bg-cream md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {active.links.map((link: NavLink) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-charcoal/80 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-charcoal px-3 py-3 text-center text-base font-medium text-cream"
                >
                  Hire Me
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
