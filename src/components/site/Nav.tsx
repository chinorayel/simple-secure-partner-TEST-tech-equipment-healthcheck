import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BOOKING_URL } from "@/lib/booking";
import logoUrl from "@/assets/sss-logo.png";

const anchorLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#solutions", label: "Solutions" },
  { href: "#why", label: "Why Us" },
  { href: "#team", label: "Team" },
  { href: "#industries", label: "Industries" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // Anchor links (#about, #solutions, ...) only exist on the homepage.
  // On any other route, point them back to the homepage anchor instead of
  // silently doing nothing.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href={onHome ? "#top" : "/#top"} className="flex items-center gap-2.5 group">
          <img
            src={logoUrl}
            alt="Simple Secure Solutions"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-navy tracking-tight sm:text-sm">Simple Secure Solutions</span>
            <span className="hidden sm:block text-[11px] text-muted-foreground uppercase tracking-[0.14em]">Business Operations Partner</span>
          </span>

        </a>

        <nav className="hidden md:flex items-center gap-1">
          {anchorLinks.map((l) => (
            <a
              key={l.href}
              href={onHome ? l.href : `/${l.href}`}
              className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-navy hover:bg-secondary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/technology-solutions"
            className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-navy hover:bg-secondary transition-colors"
            activeProps={{ className: "text-navy bg-secondary" }}
          >
            Technology Solutions
          </Link>
        </nav>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-medium text-navy-foreground shadow-soft hover:bg-navy/90 transition-colors"
        >
          Book a Business Consultation
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
