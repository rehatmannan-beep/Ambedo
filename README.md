# Ambedo Scaffolding — Website

A fast, SEO-optimized marketing website for **Ambedo**, a New York City scaffolding
company specializing in **supported scaffolding, sidewalk sheds (bridging), and
overhead protection**. Built as a lightweight static site (plain HTML/CSS/JS) for
maximum Core Web Vitals performance and clean SEO — ideal for Google Ads landing pages.

## ✨ What's included

- **5 pages** — Home, Services, About, Contact, plus a Thank-You page and a custom 404
- **Working lead capture** — quote/contact forms wired to **Netlify Forms** (no backend needed)
- **SEO built in** — unique title + meta descriptions per page, canonical URLs, Open Graph
  & Twitter cards, JSON-LD structured data (LocalBusiness, Service, Breadcrumbs, ContactPage),
  `sitemap.xml`, `robots.txt`, and a web app manifest
- **Fast & responsive** — no frameworks, no external images (custom inline SVG artwork),
  mobile-first layout, accessible markup, `prefers-reduced-motion` support
- **Netlify-ready** — `netlify.toml` with clean URLs, caching, and security headers

## 📁 Project structure

```
.
├── index.html          # Home
├── services.html       # Services (supported scaffolding, sheds, bridging, debris)
├── about.html          # About / company
├── contact.html        # Contact + full quote form (main conversion page)
├── thank-you.html      # Post-submission confirmation (noindex)
├── 404.html            # Custom not-found page
├── css/styles.css      # Design system + all styles
├── js/main.js          # Nav, FAQ accordion, scroll reveal, form UX
├── images/og-image.svg # Social share image
├── favicon.svg         # Brand mark / favicon
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── netlify.toml        # Netlify config (redirects, headers, caching)
```

## 🚀 Deploy to Netlify

**Option A — Connect the Git repo (recommended)**
1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. In Netlify: **Add new site → Import an existing project → pick this repo.**
3. Build command: *(leave empty)*. Publish directory: `.` (already set in `netlify.toml`).
4. Deploy. Every push to your branch auto-deploys.

**Option B — Drag & drop**
- Zip the project folder and drop it onto the Netlify dashboard.

### Hook up your domain
- Netlify → **Domain settings** → add your custom domain and enable HTTPS (free).

## 📬 How the forms work (Netlify Forms)

Both the homepage and contact forms post to **Netlify Forms** — no server required.

- Submissions appear in your Netlify dashboard under **Forms → `quote`**.
- Turn on email/Slack notifications: **Site settings → Forms → Form notifications.**
  Point these at your real inbox (e.g. `rehatmannan@gmail.com`).
- Spam is filtered with a hidden honeypot field (`bot-field`). For more protection,
  enable reCAPTCHA in Netlify's form settings.
- After submitting, visitors are sent to `thank-you.html` — a good place to fire a
  **Google Ads conversion / GA4 event** (see below).

> Forms only work once the site is deployed **on Netlify** (they're processed at the
> Netlify edge). They won't capture submissions when opened as a local file.

## ✅ Before you go live — update these placeholders

I used clearly-marked placeholders where I didn't have your real info yet. Search &
replace across all files:

| Placeholder | Replace with | Where |
|---|---|---|
| `(212) 555-0100` / `+12125550100` | Your real phone | all `.html` |
| `info@ambedo.com` | Your real email | all `.html` |
| `https://www.ambedo.com` | Your real domain | all `.html`, `sitemap.xml`, `robots.txt` |
| `123 Example Ave … 10001` | Your business address | `index.html` (LocalBusiness JSON-LD) |
| Social links (`href="#"`) | Facebook/Instagram/LinkedIn URLs | footer of each page |
| Stats (`500+`, `15+`, etc.) | Your real numbers | `index.html`, `about.html` |
| Testimonials | Real client reviews | `index.html` |

> Tip: keep your **phone, address, and business name identical** everywhere (site,
> Google Business Profile, directories). This "NAP consistency" matters for local SEO.

## 📈 SEO & Google Ads notes

- Each page has a unique, keyword-focused `<title>` and meta description.
- Structured data (JSON-LD) helps you qualify for rich results and local packs.
  Validate it at <https://search.google.com/test/rich-results>.
- After deploying, submit `sitemap.xml` in **Google Search Console**.
- **Conversion tracking:** add your GA4 / Google Ads tag to the `<head>` of each page,
  and fire a conversion on `thank-you.html`. Because form submissions redirect there,
  it's a clean conversion trigger for your ad campaigns.
- Landing-page relevance: the homepage and `contact.html` are strong ad destinations.
  You can deep-link the quote form and preselect a service, e.g.
  `contact.html?service=Sidewalk%20Shed` (handled by `js/main.js`).

## 🎨 Customizing the look

All colors, fonts, spacing, and shadows are CSS variables at the top of
`css/styles.css` (`:root`). Change the brand color by editing `--amber`. The industrial
navy is `--ink`. Fonts are Archivo (headings) + Inter (body) via Google Fonts.

## 🧪 Preview locally

It's static, so any local server works:

```bash
# Python
python3 -m http.server 8080
# then open http://localhost:8080
```

(Forms won't submit locally — that only works on the deployed Netlify site.)

---

© Ambedo Scaffolding. Built for scaffolding, sidewalk sheds & bridging in New York City.
