import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BOOKING_URL } from "@/lib/booking";
import logoUrl from "@/assets/sss-logo.png";

const primaryLinks = [
  { href: "#top", label: "Home" },
  { href: "#contact", label: "Contact" },
];

const aboutLinks = [
  { href: "#about", label: "About Us" },
  { href: "#why", label: "Why Us" },
  { href: "#team", label: "Our Team" },
  { href: "#industries", label: "Industries" },
];

const solutionLinks = [
  { href: "#solutions", label: "All Solutions" },
  { href: "/technology-solutions", label: "Technology Solutions", route: true },
];

const assessmentLinks = [
  { href: "/health-check/technology-equipment", label: "Technology Equipment Health Check", route: true },
  { href: "/health-check/network-cctv", label: "Network & CCTV Health Check", route: true },
  { label: "Marketing Health Check", comingSoon: true },
  { label: "Business Operations Health Check", comingSoon: true },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const homeHref = (href: string) => (onHome ? href : `/${href}`);

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
          <a
            href={homeHref(primaryLinks[0].href)}
            className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-navy hover:bg-secondary transition-colors"
          >
            Home
          </a>

          <Dropdown label="About">
            {aboutLinks.map((item) => (
              <DropdownAnchor key={item.href} href={homeHref(item.href)} label={item.label} />
            ))}
          </Dropdown>

          <Dropdown label="Solutions">
            {solutionLinks.map((item) =>
              item.route ? (
                <DropdownLink key={item.href} to={item.href} label={item.label} />
              ) : (
                <DropdownAnchor key={item.href} href={homeHref(item.href)} label={item.label} />
              ),
            )}
          </Dropdown>

          <Dropdown label="Assessments">
            {assessmentLinks.map((item) =>
              item.comingSoon ? (
                <span
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-muted-foreground/60"
                >
                  {item.label}
                  <span className="ml-4 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                    Coming soon
                  </span>
                </span>
              ) : (
                <DropdownLink key={item.href} to={item.href!} label={item.label} />
              ),
            )}
          </Dropdown>

          <a
            href={homeHref(primaryLinks[1].href)}
            className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-navy hover:bg-secondary transition-colors"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-medium text-navy-foreground shadow-soft hover:bg-navy/90 transition-colors"
          >
            Book a Business Consultation
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-navy shadow-soft md:hidden"
          >
            <span className="text-xl leading-none" aria-hidden>{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 px-6 pb-6 pt-3 shadow-soft backdrop-blur-md md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1">
            <MobileAnchor href={homeHref("#top")} label="Home" />
            <MobileAnchor href={homeHref("#about")} label="About" />
            <MobileAnchor href={homeHref("#solutions")} label="Solutions" />
            <Link
              to="/assessments"
              className="block rounded-xl bg-copper-soft/60 px-4 py-3 text-sm font-semibold text-navy"
            >
              Assessments
            </Link>
            <MobileAnchor href={homeHref("#contact")} label="Contact" />
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-medium text-navy-foreground shadow-soft"
            >
              Book a Business Consultation →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileAnchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-navy"
    >
      {label}
    </a>
  );
}

function Dropdown({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-navy hover:bg-secondary transition-colors"
        aria-haspopup="menu"
      >
        {label}
        <span className="text-[11px] transition-transform duration-200 group-hover:rotate-180">⌄</span>
      </button>
      <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-2xl border border-border bg-card p-2 shadow-elevated">
          {children}
        </div>
      </div>
    </div>
  );
}

function DropdownAnchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-xl px-4 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-secondary hover:text-navy"
    >
      {label}
    </a>
  );
}

function DropdownLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block rounded-xl px-4 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-secondary hover:text-navy"
      activeProps={{ className: "block rounded-xl px-4 py-2.5 text-sm text-navy bg-secondary" }}
    >
      {label}
    </Link>
  );
}