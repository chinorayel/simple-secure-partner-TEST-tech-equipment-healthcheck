import { createFileRoute, Link } from "@tanstack/react-router";
import { BOOKING_URL } from "@/lib/booking";
import logoUrl from "@/assets/sss-logo.png";
import { Nav } from "@/components/site/Nav";
import { Reveal } from "@/components/site/Reveal";
import { PCBLines } from "@/components/site/PCBLines";
import heroTeam from "@/assets/hero-team.jpg";
import aboutPartnership from "@/assets/about-partnership.jpg";
import teamExpertise from "@/assets/team-expertise.jpg";
import solutionsTechnology from "@/assets/solutions-technology.jpg";
import solutionsSupport from "@/assets/solutions-support.jpg";
import ctaTeam from "@/assets/cta-team.jpg";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Headphones,
  Laptop,
  MessageCircle,
  Network,
  ShieldCheck,
  Calendar,
  Mail,
  ClipboardList,
  Building2,
  Briefcase,
  ShoppingBag,
  HeartPulse,
  HardHat,
  TrendingUp,
  Sparkles,
  Globe2,
  HandshakeIcon,
  Zap,
  Layers,
  Target,
  ChevronsUp,
  MapPin,
  PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Simple Secure Solutions | Business Operations & Technology Solutions" },
      {
        name: "description",
        content:
          "Simple Secure Solutions is a business operations partner helping small and growing businesses operate better through reliable technology solutions and professional business support services.",
      },
      {
        property: "og:title",
        content: "Simple Secure Solutions | Business Operations & Technology Solutions",
      },
      {
        property: "og:description",
        content:
          "Simple Secure Solutions helps small and growing businesses operate better through reliable technology solutions and professional business support services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://simple-secure-partner.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://simple-secure-partner.lovable.app/" }],

  }),
  component: Home,
});

const techServices = [
  { icon: Laptop, label: "IT Management & Support" },
  { icon: Network, label: "Network Solutions" },
  { icon: ShieldCheck, label: "CCTV & Surveillance" },
  { icon: Sparkles, label: "AI Integrations" },
  { icon: Globe2, label: "Website Development" },
];

const bizServices = [
  { icon: Headphones, label: "Customer Support" },
  { icon: PhoneCall, label: "Call Center" },
  { icon: ClipboardList, label: "Administrative Support" },
  { icon: MessageCircle, label: "Live Chat" },
  { icon: Mail, label: "Email Support" },
  { icon: Calendar, label: "Appointment Scheduling" },
  { icon: Briefcase, label: "Back Office Support" },
];

const benefits = [
  {
    icon: HandshakeIcon,
    title: "Reliable Partnership",
    body: "A long-term relationship built on consistency, transparency, and genuine care for your operations.",
  },
  {
    icon: Zap,
    title: "Responsive Support",
    body: "Quick, human responses when it matters — from urgent issues to everyday questions.",
  },
  {
    icon: Sparkles,
    title: "Simple Solutions",
    body: "We remove complexity. Clear processes, clean systems, and outcomes that make sense.",
  },
  {
    icon: Target,
    title: "Business-Focused Approach",
    body: "We understand operations, not just technology. Every decision serves your business goals.",
  },
  {
    icon: Layers,
    title: "Scalable Services",
    body: "From a small team to a growing organization, our support scales quietly alongside you.",
  },
  {
    icon: ChevronsUp,
    title: "Continuous Improvement",
    body: "We refine, review, and evolve — so your operations get sharper with every quarter.",
  },
];

const industries = [
  { icon: Building2, label: "Small Businesses", copy: "Foundations that scale with you." },
  { icon: Briefcase, label: "Professional Services", copy: "Operations that mirror your standards." },
  { icon: ShoppingBag, label: "Retail", copy: "Reliable systems, happy customers." },
  { icon: HeartPulse, label: "Healthcare", copy: "Secure, compliant, always available." },
  { icon: HardHat, label: "Construction", copy: "Coordinated support on and off site." },
  { icon: TrendingUp, label: "Growing Companies", copy: "Infrastructure ready for the next stage." },
];

function Home() {
  return (
    <div id="top" className="relative min-h-screen bg-background">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" aria-hidden />
        <PCBLines variant="left" className="absolute left-0 top-24 hidden h-[420px] w-[280px] lg:block pointer-events-none" opacity={0.35} />
        <PCBLines variant="right" className="absolute right-0 bottom-10 hidden h-[380px] w-[260px] lg:block pointer-events-none" opacity={0.28} />
        <div
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-navy shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                Business Operations + Technology Solutions
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[60px]">
                Simple <span className="text-copper">Secure</span> Solutions
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 font-display text-xl font-semibold text-navy/80 sm:text-2xl">
                Your Trusted Business Operations Partner
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Helping small and growing businesses operate better through reliable technology
                and professional business support.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3.5 text-sm font-medium text-copper-foreground shadow-copper transition-all hover:brightness-105 hover:-translate-y-0.5"
                >
                  Book a Business Consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#solutions"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-navy shadow-soft hover:bg-secondary transition-colors"
                >
                  Explore Our Solutions
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { k: "10+", v: "Years partnering" },
                  { k: "24/7", v: "Responsive support" },
                  { k: "100%", v: "Business focused" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-3xl font-bold text-navy">{s.k}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-[2rem] opacity-50 blur-2xl"
                  style={{ background: "radial-gradient(circle at 40% 30%, var(--copper-soft), transparent 65%)" }}
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
                  <img
                    src={heroTeam}
                    alt="A professional business team collaborating around a table"
                    className="h-auto w-full object-cover"
                    width={1024}
                    height={1024}
                  />
                  {/* Subtle brand overlay — faint hexagon + copper tint to integrate art with brand */}
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(13,27,42,0.18), transparent 55%), radial-gradient(circle at 80% 100%, var(--copper-soft), transparent 60%)",
                    }}
                    aria-hidden
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-copper-soft text-copper">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">Operations, simplified</div>
                    <div className="text-sm font-semibold text-navy">Technology + Support, together</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  About Us
                </div>
                <h2 className="mt-4 font-display text-5xl leading-[1.05] text-navy lg:text-6xl">
                  A partner, not just a provider.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <div className="relative mt-10 hidden lg:block">
                  <div
                    className="absolute -inset-3 rounded-[1.75rem] opacity-40 blur-2xl"
                    style={{ background: "radial-gradient(circle at 30% 30%, var(--copper-soft), transparent 65%)" }}
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-soft">
                    <img
                      src={aboutPartnership}
                      alt="Two business professionals sharing a handshake in a bright modern office"
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      width={1280}
                      height={960}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-50"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(13,27,42,0.16), transparent 60%), radial-gradient(circle at 85% 100%, var(--copper-soft), transparent 60%)",
                      }}
                      aria-hidden
                    />
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal delay={100}>
                <p className="text-xl leading-relaxed text-foreground/85">
                  Simple Secure Solutions is a{" "}
                  <span className="text-navy font-medium">Business Operations Partner</span> for
                  small and growing businesses. We go beyond IT — supporting both the technology
                  that runs your business and the daily operations that keep it moving.
                </p>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  From managed technology to customer-facing and back-office support, we bring
                  everything under one calm, coordinated relationship. Fewer vendors. Clearer
                  operations. More time for the work only you can do.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    "One trusted partner across tech & operations",
                    "Predictable, transparent engagements",
                    "Human, business-first thinking",
                    "Built for how you actually work",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-copper-soft text-copper">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="relative py-24 lg:py-32 bg-surface overflow-hidden">
        <PCBLines variant="divider" className="absolute inset-x-0 top-0 h-10 w-full pointer-events-none" opacity={0.5} />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                Our Solutions
              </div>
              <h2 className="mt-4 font-display text-5xl leading-[1.05] text-navy lg:text-6xl">
                Two pillars. One partner.
              </h2>
              <p className="mt-5 text-base text-muted-foreground">
                Reliable technology and professional business support — designed to work together.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Tech card */}
            <Reveal delay={80}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-1">
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={solutionsTechnology}
                    alt="Diverse team collaborating around a laptop in a bright office"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    width={1200}
                    height={900}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(13,27,42,0.05) 0%, rgba(13,27,42,0.35) 100%)",
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-70"
                    style={{
                      background:
                        "radial-gradient(circle at 85% 100%, var(--copper-soft), transparent 60%)",
                    }}
                    aria-hidden
                  />
                </div>
                <div className="relative p-10">
                  <div
                    className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-60"
                    style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
                      <Laptop className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 font-display text-3xl text-navy">Technology Solutions</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Managed, monitored, and supported — so your systems quietly do their job.
                    </p>
                    <ul className="mt-8 space-y-3">
                      {techServices.map((s) => (
                        <li
                          key={s.label}
                          className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-secondary"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-copper-soft text-copper">
                            <s.icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/technology-solutions"
                      className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
                    >
                      Explore Technology Solutions
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Biz card */}
            <Reveal delay={160}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-1">
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={solutionsSupport}
                    alt="Professional customer support specialist smiling while assisting a client"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    width={1200}
                    height={900}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(13,27,42,0.05) 0%, rgba(13,27,42,0.35) 100%)",
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-70"
                    style={{
                      background:
                        "radial-gradient(circle at 15% 100%, var(--copper-soft), transparent 60%)",
                    }}
                    aria-hidden
                  />
                </div>
                <div className="relative p-10">
                  <div
                    className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-60"
                    style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-copper text-copper-foreground shadow-copper">
                      <Headphones className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 font-display text-3xl text-navy">Business Support Solutions</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Professional people supporting your customers, calendar, and back office.
                    </p>
                    <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {bizServices.map((s) => (
                        <li
                          key={s.label}
                          className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-secondary"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-copper-soft text-copper">
                            <s.icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* HEALTH CHECKS */}
      <section id="assessments" className="relative py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                Business Health Assessments
              </div>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-navy sm:text-5xl">
                Find out where your business stands.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Choose an assessment to take a closer look at an important part of your business technology.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal delay={80}>
              <Link
                to="/health-check/technology-equipment"
                className="group block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper">
                    <Laptop className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-navy">Technology Equipment Health Check</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      A practical look at the computers and equipment your business relies on every day.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy">
                      Take the Health Check
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            <Reveal delay={140}>
              <Link
                to="/health-check/network-cctv"
                className="group block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper">
                    <Network className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-navy">Network &amp; CCTV Health Check</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      A practical look at your connectivity, network reliability, power protection and CCTV readiness.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy">
                      Take the Health Check
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <div className="max-w-xl">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Why Partner With Us
                </div>
                <h2 className="mt-4 font-display text-5xl leading-[1.05] text-navy lg:text-6xl">
                  Built for how you actually work.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-base text-muted-foreground">
                We focus on the outcomes that matter — reliability, clarity, and a partnership
                that grows with your business.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 60}>
                <div className="group h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-copper-soft text-copper transition-colors group-hover:bg-copper group-hover:text-copper-foreground">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-navy">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="relative py-24 lg:py-32 overflow-hidden">
        <PCBLines variant="divider" className="absolute inset-x-0 top-0 h-10 w-full pointer-events-none" opacity={0.5} />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Our Team
                </div>
                <h2 className="mt-4 font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
                  Meet Our Team of Experts
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-8 text-lg leading-relaxed text-foreground/85">
                  At Simple Secure Solutions, we bring together a team of professionals with
                  diverse backgrounds, experience, and areas of expertise.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  We understand that every business is different. That's why our team takes the
                  time to understand your goals, challenges, and unique requirements before
                  recommending the right solution.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  From technology and security to business operations and digital solutions, our
                  combined knowledge allows us to look at challenges from different perspectives
                  and deliver practical solutions that support your business.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={160}>
                <div className="relative">
                  <div
                    className="absolute -inset-4 rounded-[2rem] opacity-40 blur-2xl"
                    style={{ background: "radial-gradient(circle at 65% 35%, var(--copper-soft), transparent 65%)" }}
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-soft">
                    <img
                      src={teamExpertise}
                      alt="Abstract network of connected hexagons and circuit traces representing multidisciplinary expertise"
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      width={1280}
                      height={960}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-50"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(13,27,42,0.14), transparent 60%), radial-gradient(circle at 15% 100%, var(--copper-soft), transparent 60%)",
                      }}
                      aria-hidden
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={120}>
            <div className="relative mt-16 overflow-hidden rounded-[1.5rem] bg-navy px-8 py-12 text-center shadow-elevated sm:px-12 lg:mt-20">
              <PCBLines
                variant="corner"
                className="absolute inset-0 h-full w-full pointer-events-none"
                opacity={0.35}
              />
              <p className="relative mx-auto max-w-3xl font-display text-2xl leading-[1.25] text-navy-foreground sm:text-3xl lg:text-4xl">
                Different expertise.{" "}
                <span className="text-copper">One team.</span>{" "}
                Focused on helping your business move forward.
              </p>
            </div>
          </Reveal>
        </div>
      </section>


      {/* INDUSTRIES */}
      <section id="industries" className="relative py-24 lg:py-32 bg-surface overflow-hidden">
        <PCBLines variant="divider" className="absolute inset-x-0 top-0 h-10 w-full pointer-events-none" opacity={0.5} />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                Industries We Serve
              </div>
              <h2 className="mt-4 font-display text-5xl leading-[1.05] text-navy lg:text-6xl">
                Trusted across industries.
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.label} delay={i * 60}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-navy-foreground">
                      <ind.icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-copper group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-navy">{ind.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{ind.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-8 py-16 text-navy-foreground shadow-elevated sm:px-16 sm:py-24">
              <img
                src={ctaTeam}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                loading="lazy"
                width={1600}
                height={900}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.78) 55%, rgba(13,27,42,0.55) 100%)",
                }}
                aria-hidden
              />
              <div
                className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, var(--copper), transparent 65%)" }}
                aria-hidden
              />
              <div
                className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 65%)" }}
                aria-hidden
              />
              <div className="relative max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-navy-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                  Free consultation
                </span>
                <h2 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl">
                  Let's build a <span className="text-copper">better business</span>{" "}
                  together.
                </h2>
                <p className="mt-6 max-w-xl text-base text-navy-foreground/75">
                  Tell us where operations feel heavy today. We'll show you a simpler,
                  more reliable way forward — with a partner who stays.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3.5 text-sm font-medium text-copper-foreground shadow-copper transition-all hover:brightness-105 hover:-translate-y-0.5"
                  >
                    Book a Business Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#solutions"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-navy-foreground hover:bg-white/10 transition-colors"
                  >
                    Explore Our Solutions
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border bg-background overflow-hidden">
        <PCBLines variant="divider" className="absolute inset-x-0 top-0 h-10 w-full pointer-events-none" opacity={0.4} />
        <PCBLines variant="corner" className="absolute right-0 bottom-0 h-40 w-40 pointer-events-none" opacity={0.25} />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2.5">
                <img src={logoUrl} alt="Simple Secure Solutions" className="h-10 w-10 object-contain" />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-navy">Simple Secure Solutions</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-[0.14em]">Business Operations Partner</div>
                </div>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Simple Secure Solutions helps small and growing businesses operate better through
                reliable Technology Solutions and Business Support Services.
              </p>

            </div>

            <div className="lg:col-span-3">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-navy">
                Navigate
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  ["About", "#about"],
                  ["Solutions", "#solutions"],
                  ["Why Us", "#why"],
                  ["Industries", "#industries"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-muted-foreground hover:text-navy transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-navy">
                Contact
              </div>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-copper" />
                  <a href="mailto:hello@simplesecure.solutions" className="hover:text-copper transition-colors">
                    hello@simplesecure.solutions
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneCall className="mt-0.5 h-4 w-4 text-copper" />
                  +63 908 160 5277
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-copper" />
                  Supporting businesses wherever they operate
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} Simple Secure Solutions. All rights reserved.</div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-navy transition-colors">Privacy</a>
              <a href="#" className="hover:text-navy transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
