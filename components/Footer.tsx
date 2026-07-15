import Link from "next/link";
import type { Nav, Contact } from "@/lib/types";

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

export default function Footer({
  nav,
  contact,
}: {
  nav?: Nav;
  contact?: Contact;
}) {
  const links = nav && nav.links.length > 0 ? nav.links : FALLBACK_NAV.links;
  const socials = contact?.socials ?? [];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-charcoal/10 bg-charcoal text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 lg:px-10">
        <div>
          <p className="font-playfair text-2xl font-semibold">{nav?.logo ?? "Anu Thapa"}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Technical Writer crafting clear, user-friendly documentation from
            Brisbane, Australia and Butwal, Nepal.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
            Quick Links
          </p>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/80 transition-colors hover:text-teal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
            Connect
          </p>
          <ul className="mt-4 space-y-3">
            {Array.isArray(socials) && socials.length > 0 ? (
              socials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream/80 transition-colors hover:text-teal"
                  >
                    {s.platform}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-sm text-cream/50">LinkedIn, GitHub, X, Medium</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-cream/50 sm:flex-row lg:px-10">
          <p>
            &copy; {year} {nav?.logo ?? "Anu Thapa"}. All rights reserved.
          </p>
          <p>Clarity Through Technical Writing</p>
        </div>
      </div>
    </footer>
  );
}
