# Simple Secure Solutions

Create a premium, modern, and minimal corporate website for "Simple Secure Solutions."

Simple Secure Solutions is a Business Operations Partner that helps small and growing businesses operate more efficiently through Technology Solutions and Business Support Services.

This is NOT an IT company website. The website should communicate trust, professionalism, simplicity, and long-term partnership.

## Design Style

Create a clean, bright website with a predominantly white background.

Use:

- White as the primary color

- Dark Navy Blue for headings, navigation, and important sections

- Copper / Warm Orange as the accent color for buttons, icons, highlights, and subtle design elements

The design should feel similar to Apple, Stripe, Notion, and Linear:

- Minimal

- Premium

- Spacious

- Modern

- Elegant

- Large typography

- Plenty of whitespace

- Rounded cards

- Soft shadows

- Smooth scrolling animations

- Professional illustrations and subtle geometric backgrounds

- Avoid clutter

- Avoid generic IT website layouts

## Branding

Tagline:

"Your Trusted Business Operations Partner"

Core Message:

Helping businesses operate better through reliable Technology Solutions and Business Support Services.

## Homepage Structure

1. Hero Section

Large headline:

Helping Your Business Operate Better.

Supporting text:

Simple Secure Solutions partners with small and growing businesses to simplify operations through reliable technology and professional business support, allowing you to focus on growth.

Buttons:

• Book a Consultation

• Explore Our Solutions

Include a professional business illustration or abstract modern graphic—not servers, cables, or generic tech imagery.

---

2. About Us

Introduce Simple Secure Solutions as a trusted Business Operations Partner.

Explain that the company goes beyond IT by supporting both technology and daily business operations.

---

3. Our Solutions

Display two elegant cards:

Technology Solutions

- Managed IT

- IT Support

- Network Solutions

- CCTV

- Cloud & Security

Business Support Solutions

- Customer Support

- Call Center

- Administrative Support

- Live Chat

- Email Support

- Appointment Scheduling

- Back Office Support

---

4. Why Partner With Us

Highlight benefits instead of features:

• Reliable Partnership

• Responsive Support

• Simple Solutions

• Business-Focused Approach

• Scalable Services

---

5. Industries We Serve

Display modern cards for:

- Small Businesses

- Professional Services

- Retail

- Healthcare

- Construction

- Growing Companies

---

6. Call To Action

Headline:

Let's Build a Better Business Together.

Button:

Schedule a Free Consultation

---

7. Footer

Professional and minimal.

Include navigation, contact information, social links, and copyright.

## Overall Feel

The website should immediately communicate:

Professional.

Trustworthy.

Modern.

Premium.

Business-focused.

Visitors should feel that Simple Secure Solutions helps businesses operate better—not simply fix computers.

Avoid stock-looking IT company designs. Create a unique identity that reflects a modern Business Operations Partner.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://simple-secure-partner.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38dab01b-36a0-437e-9eb9-fec1c0933233).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Technology Equipment Health Check widget (TEST environment)

A new `/technology-solutions` page hosts an embedded, step-by-step version of
the existing Technology Equipment Health Check (`/health-check/technology-equipment`
remains unchanged and still works standalone). The widget reuses the same
questions and scoring engine (`src/lib/health-check/technology-equipment.ts`)
and adds:

- Customer info collection (business name, contact name, email required; phone optional) with consent wording.
- Secure server-side persistence of full submissions (raw answers + a snapshot of the calculated result), separate from the existing localStorage-only flow (which is preserved so the existing results page keeps working unchanged).
- A simple admin view at `/admin/health-checks` (login at `/admin/login`) to review submissions.

**Before using admin login locally**, copy `.env.example` to `.env.local` and set:

```
ADMIN_PASSWORD=<a strong password>
ADMIN_SESSION_SECRET=<output of: openssl rand -hex 32>
```

Submissions are currently stored in a local JSON file at `.data/tech-equipment-submissions.json`
(git-ignored). This is intentionally a TEST-environment default — see the
comments in `src/lib/health-check/submissions-store.server.ts` for how to
swap in a real database later without touching the routes, components, or
scoring logic.
