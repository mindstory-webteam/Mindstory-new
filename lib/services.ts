/* ══════════════════════════════════════════════════════════════════════
   SERVICES DATA — every service page is built from this file.
   Add a service here and /services/<slug> exists automatically.

   IMAGES: put them in /public/images/services/<slug>/
     overview.jpg   — big image beside "Why it matters"
     work-1.jpg     — large gallery card
     work-2.jpg     — gallery card
     work-3.jpg     — gallery card
   plus one shared banner: /public/images/services/team.jpg
   Missing images show a branded placeholder, so pages never break.
   ══════════════════════════════════════════════════════════════════════ */

export type ServiceIconName =
  | "strategy"
  | "identity"
  | "video"
  | "social"
  | "ads"
  | "seo"
  | "web"
  | "ecommerce";

export type CategoryId = "brand" | "growth" | "digital";

export type ServiceImage = { src: string; alt: string };

export type Service = {
  slug: string;
  category: CategoryId;
  icon: ServiceIconName;
  /** name in menus and cards */
  title: string;
  /** one-liner under the name (same as the mega menu) */
  short: string;
  /** detail-page headline: [plain part, orange part] */
  headline: [string, string];
  /** paragraph under the headline */
  intro: string;
  /** three quick facts shown under the hero */
  highlights: { value: string; label: string }[];
  /** "Why it matters" — image + text + checklist */
  overview: {
    title: [string, string];
    text: string;
    points: string[];
    image: ServiceImage;
  };
  /** "What's included" cards */
  deliverables: { title: string; text: string }[];
  /** image gallery — 3 items, the first one is shown large */
  showcase: { title: string; tag: string; image: ServiceImage }[];
  /** "How we do it" steps */
  process: { title: string; text: string }[];
  /** "Who it's for" chips */
  industries: string[];
  /** "Tools we use" strip */
  tools: string[];
  faqs: { q: string; a: string }[];
  /** slugs of services to suggest at the bottom */
  related: string[];
  seo: { title: string; description: string };
};

/** image path helper → /images/services/<slug>/<file> */
const img = (slug: string, file: string, alt: string): ServiceImage => ({
  src: `/images/services/${slug}/${file}`,
  alt,
});

export const categories: { id: CategoryId; label: string; title: string; text: string }[] = [
  {
    id: "brand",
    label: "Brand",
    title: "Build a brand people remember",
    text: "Strategy, identity and film that give your business a clear voice and a face people recognise.",
  },
  {
    id: "growth",
    label: "Growth",
    title: "Get found, followed and chosen",
    text: "Social, paid ads and SEO working together to bring the right people to you — and measured every month.",
  },
  {
    id: "digital",
    label: "Digital",
    title: "Turn visitors into customers",
    text: "Fast, modern websites and online stores built to convert, not just to look good.",
  },
];

/** "Why Mindstory" banner — shared by every service page */
export const whyMindstory = {
  image: { src: "/images/services/team.jpg", alt: "The Mindstory team at work" } as ServiceImage,
  reasons: [
    { value: "Since 2016", text: "Nearly a decade of building brands from Thrissur." },
    { value: "30+", text: "Strategists, designers, film-makers and performance marketers under one roof." },
    { value: "Google Partner", text: "A certified team running search, display and YouTube campaigns." },
    { value: "Kerala & GCC", text: "Local insight with reach across the Gulf." },
  ],
};

export const services: Service[] = [
  /* ─────────────── BRAND ─────────────── */
  {
    slug: "brand-strategy",
    category: "brand",
    icon: "strategy",
    title: "Brand strategy",
    short: "Positioning and messaging",
    headline: ["Know exactly who you are — ", "and why it matters."],
    intro:
      "We dig into your business, your market and your customers to define a clear position and a message that sets you apart. Every campaign we run after that starts from this foundation.",
    highlights: [
      { value: "Workshop", label: "led discovery with your team" },
      { value: "1", label: "brand book your whole team can use" },
      { value: "10+", label: "years of brand-building in Kerala" },
    ],
    overview: {
      title: ["Strategy first, ", "so everything else lands."],
      text: "Most marketing problems are really positioning problems. When your team agrees on who you serve and what you promise, design, content and ads all pull in the same direction — and customers feel the difference.",
      points: [
        "A clear position competitors can't easily copy",
        "Messages tailored to each audience you sell to",
        "A brand book your team and partners actually use",
        "Faster decisions, with less back-and-forth",
      ],
      image: img("brand-strategy", "overview.jpg", "Brand strategy workshop with sticky notes on a wall"),
    },
    deliverables: [
      { title: "Brand discovery", text: "Workshops and interviews to understand your mission, vision and what makes you different." },
      { title: "Market & competitor audit", text: "Where you stand today, who you compete with and the gaps you can own." },
      { title: "Audience personas", text: "Clear pictures of the people you want to reach and what moves them." },
      { title: "Positioning statement", text: "One sharp sentence that guides every decision your brand makes." },
      { title: "Messaging framework", text: "Tagline, key messages and proof points for every channel." },
      { title: "Tone of voice", text: "How your brand sounds — with do's, don'ts and real examples." },
    ],
    showcase: [
      { title: "Discovery workshops", tag: "Workshop", image: img("brand-strategy", "work-1.jpg", "Team in a brand discovery workshop") },
      { title: "Brand books", tag: "Guidelines", image: img("brand-strategy", "work-2.jpg", "Printed brand book open on a desk") },
      { title: "Messaging frameworks", tag: "Messaging", image: img("brand-strategy", "work-3.jpg", "Messaging framework on a laptop screen") },
    ],
    process: [
      { title: "Discover", text: "Workshops with your team and a deep look at your market." },
      { title: "Define", text: "We shape your positioning, audience and core message." },
      { title: "Express", text: "Messaging and tone of voice turned into a practical guide." },
      { title: "Activate", text: "We roll it out across your channels and campaigns." },
    ],
    industries: ["Startups", "Real estate", "Healthcare", "Education", "Retail", "Hospitality", "Jewellery", "FMCG"],
    tools: ["Miro", "Google Workspace", "Typeform", "SEMrush", "Meta Audience Insights", "Notion"],
    faqs: [
      { q: "Do we need brand strategy if we already have a logo?", a: "Yes — a logo is how you look; strategy is what you stand for and say. It makes every design and campaign decision easier and more consistent." },
      { q: "How long does it take?", a: "Most brand strategy projects take three to five weeks, depending on how many workshops and stakeholders are involved." },
      { q: "Is this only for new businesses?", a: "No. Established brands come to us to reposition, launch new products or enter new markets like the GCC." },
    ],
    related: ["identity-design", "social-media", "video-production"],
    seo: {
      title: "Brand Strategy Agency in Kerala | Mindstory",
      description: "Positioning, messaging and tone of voice that set your brand apart. Brand strategy by Mindstory, Thrissur & Kochi.",
    },
  },
  {
    slug: "identity-design",
    category: "brand",
    icon: "identity",
    title: "Identity design",
    short: "Logos, systems, guidelines",
    headline: ["A look that's unmistakably ", "yours."],
    intro:
      "From logo to colours, typography and patterns, we design complete identity systems that look right everywhere — on a signboard, a reel or a business card.",
    highlights: [
      { value: "3", label: "logo routes to choose from" },
      { value: "Full", label: "brand guidelines handed over" },
      { value: "All", label: "source files are yours to keep" },
    ],
    overview: {
      title: ["Designed to work ", "everywhere you show up."],
      text: "A good identity isn't just a logo — it's a system. We design every piece to hold up on a hoarding, a phone screen, a uniform or a tiny favicon, so your brand looks the same wherever people meet it.",
      points: [
        "Logos tested at every size and on every background",
        "Colour and type that work in print and on screen",
        "Templates that keep your team on-brand",
        "Guidelines that make handovers painless",
      ],
      image: img("identity-design", "overview.jpg", "Logo sketches and colour swatches on a designer's desk"),
    },
    deliverables: [
      { title: "Logo design", text: "Distinct, timeless marks with primary, secondary and icon versions." },
      { title: "Colour & typography", text: "A palette and type system that works in print and on screen." },
      { title: "Visual language", text: "Patterns, graphics and photography direction to tie it all together." },
      { title: "Stationery & collateral", text: "Business cards, letterheads, brochures and presentation templates." },
      { title: "Social templates", text: "Ready-made post and story templates so your feed stays on-brand." },
      { title: "Brand guidelines", text: "A clear guide so your team and partners use the identity correctly." },
    ],
    showcase: [
      { title: "Logo systems", tag: "Logo", image: img("identity-design", "work-1.jpg", "Logo system shown in several versions") },
      { title: "Stationery suites", tag: "Print", image: img("identity-design", "work-2.jpg", "Business cards and letterhead mock-up") },
      { title: "Signage & packaging", tag: "Applications", image: img("identity-design", "work-3.jpg", "Brand identity applied to signage and packaging") },
    ],
    process: [
      { title: "Brief", text: "We start from your strategy, audience and references." },
      { title: "Explore", text: "Several creative routes presented with real-life mock-ups." },
      { title: "Refine", text: "We develop your chosen route with your feedback." },
      { title: "Deliver", text: "Final files, guidelines and templates handed over." },
    ],
    industries: ["Startups", "Restaurants & cafés", "Clinics", "Schools", "Fashion", "Real estate", "Jewellery", "Manufacturing"],
    tools: ["Adobe Illustrator", "Photoshop", "InDesign", "Figma", "After Effects", "Procreate"],
    faqs: [
      { q: "How many revisions do we get?", a: "We include rounds of revisions at each stage, so you can refine the chosen route until it feels right." },
      { q: "Can you refresh our existing logo instead of replacing it?", a: "Yes. Many clients prefer an evolution that keeps their recognition while modernising the look." },
      { q: "What files will we receive?", a: "Vector and high-resolution files for print and digital, in every colour version, plus the guidelines document." },
    ],
    related: ["brand-strategy", "web-design", "social-media"],
    seo: {
      title: "Logo & Brand Identity Design in Kerala | Mindstory",
      description: "Logos, visual identity systems and brand guidelines designed by Mindstory, Thrissur & Kochi.",
    },
  },
  {
    slug: "video-production",
    category: "brand",
    icon: "video",
    title: "Video production",
    short: "Ads, reels and films",
    headline: ["Stories that stop ", "the scroll."],
    intro:
      "Our in-house team handles concept, shoot and edit for brand films, ads and reels — the same team that has run 10+ movie promotions since 2016.",
    highlights: [
      { value: "In-house", label: "shoot, edit and music team" },
      { value: "10+", label: "movie promotions delivered" },
      { value: "Every", label: "format — reels, ads and films" },
    ],
    overview: {
      title: ["From idea to edit, ", "under one roof."],
      text: "Because our writers, directors, editors and music team sit together, ideas move quickly and nothing gets lost between agencies. You get one team responsible for the story, the shoot and every cut-down.",
      points: [
        "Scripts written around a single, clear goal",
        "Shoots planned to capture every format at once",
        "Versions for reels, ads, YouTube and OTT",
        "Music and sound design from our own studio",
      ],
      image: img("video-production", "overview.jpg", "Film crew with a camera on set"),
    },
    deliverables: [
      { title: "Brand films", text: "Cinematic stories that show who you are and why you matter." },
      { title: "Ad films", text: "Short, punchy ads made for Meta, YouTube and OTT placements." },
      { title: "Reels & shorts", text: "Vertical content built for Instagram, YouTube Shorts and beyond." },
      { title: "Product videos", text: "Clear, beautiful product showcases for websites and stores." },
      { title: "Motion graphics", text: "Animated explainers, logo stings and titles." },
      { title: "Music & sound", text: "Original music and sound design from our production team." },
    ],
    showcase: [
      { title: "Brand films", tag: "Film", image: img("video-production", "work-1.jpg", "Still frame from a brand film") },
      { title: "Product reels", tag: "Reels", image: img("video-production", "work-2.jpg", "Vertical product reel on a phone") },
      { title: "On set", tag: "Production", image: img("video-production", "work-3.jpg", "Behind the scenes of a video shoot") },
    ],
    process: [
      { title: "Concept", text: "Idea, script and storyboard built around your goal." },
      { title: "Pre-production", text: "Casting, locations, props and shoot planning." },
      { title: "Shoot", text: "Our crew captures everything in one well-planned shoot." },
      { title: "Post", text: "Edit, colour, sound and cut-downs for every platform." },
    ],
    industries: ["Movies & OTT", "Real estate", "Jewellery", "Automobile", "Food & beverage", "Healthcare", "Education", "Events"],
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D", "Logic Pro", "Frame.io"],
    faqs: [
      { q: "Do you handle everything from script to final edit?", a: "Yes — concept, script, crew, shoot, edit, colour, music and versions for each platform." },
      { q: "Can you shoot outside Thrissur and Kochi?", a: "Yes. We shoot across Kerala and travel for projects elsewhere, including the GCC." },
      { q: "How long does a video take?", a: "A reel can be turned around within days; a full brand film usually takes two to four weeks." },
    ],
    related: ["social-media", "performance-ads", "brand-strategy"],
    seo: {
      title: "Video Production & Ad Films in Kerala | Mindstory",
      description: "Brand films, ad films and reels — concept, shoot and edit by Mindstory's in-house team in Thrissur & Kochi.",
    },
  },

  /* ─────────────── GROWTH ─────────────── */
  {
    slug: "social-media",
    category: "growth",
    icon: "social",
    title: "Social media",
    short: "Content and community",
    headline: ["Show up every day, ", "and be remembered."],
    intro:
      "Strategy, design, content, posting and community management — we run your social channels end to end so your brand stays active, consistent and talked about.",
    highlights: [
      { value: "Monthly", label: "content calendar you approve" },
      { value: "1", label: "dedicated account manager" },
      { value: "500M+", label: "people reached for our clients" },
    ],
    overview: {
      title: ["Consistent, on-brand ", "and always on."],
      text: "Posting once in a while doesn't build a following. We plan, create and publish every month, reply to your community in your voice, and use the numbers to make next month better than the last.",
      points: [
        "A calendar planned around your goals, not guesswork",
        "Design and reels made by our in-house team",
        "Comments and DMs answered on time",
        "Monthly reports with clear next steps",
      ],
      image: img("social-media", "overview.jpg", "Social media posts being planned on a phone and laptop"),
    },
    deliverables: [
      { title: "Social strategy", text: "Platforms, pillars and goals tailored to your audience." },
      { title: "Content calendar", text: "A month of planned posts, ready for your approval." },
      { title: "Creative design", text: "Posts, carousels and stories designed to your brand." },
      { title: "Reels & video", text: "Short-form video produced by our in-house team." },
      { title: "Community management", text: "Replies, comments and DMs handled on time, in your voice." },
      { title: "Influencer marketing", text: "The right creators to put your brand in front of new people." },
    ],
    showcase: [
      { title: "Feed design", tag: "Instagram", image: img("social-media", "work-1.jpg", "Instagram grid with branded posts") },
      { title: "Reel series", tag: "Reels", image: img("social-media", "work-2.jpg", "Creator filming a reel") },
      { title: "Creator collaborations", tag: "Influencers", image: img("social-media", "work-3.jpg", "Influencer holding a product") },
    ],
    process: [
      { title: "Audit", text: "We review your channels, competitors and audience." },
      { title: "Plan", text: "Strategy and a monthly calendar you approve." },
      { title: "Create & post", text: "We design, write, schedule and engage." },
      { title: "Report", text: "Monthly insights and what we'll improve next." },
    ],
    industries: ["Restaurants & cafés", "Fashion", "Real estate", "Healthcare", "Education", "Fitness", "Travel", "Retail"],
    tools: ["Meta Business Suite", "Figma", "Canva", "CapCut", "Later", "Google Analytics"],
    faqs: [
      { q: "Which platforms do you manage?", a: "Instagram, Facebook, LinkedIn, YouTube and X — we recommend the ones that matter for your audience." },
      { q: "Do we approve posts before they go live?", a: "Yes. You approve the monthly calendar, and we can share each post before it's published." },
      { q: "Can you also run ads on social?", a: "Yes — pair this with our performance ads service for paid reach alongside organic content." },
    ],
    related: ["performance-ads", "video-production", "identity-design"],
    seo: {
      title: "Social Media Marketing Agency in Kerala | Mindstory",
      description: "Social media strategy, content, reels and community management by Mindstory, Thrissur & Kochi.",
    },
  },
  {
    slug: "performance-ads",
    category: "growth",
    icon: "ads",
    title: "Performance ads",
    short: "Meta & Google campaigns",
    headline: ["Ad spend that ", "pays you back."],
    intro:
      "Google Ads and Meta campaigns planned around clear KPIs — leads, sales or footfall — and optimised every week. We've managed over ₹1 crore in Google Ads spend for clients.",
    highlights: [
      { value: "₹1 Cr+", label: "Google Ads spend managed" },
      { value: "Weekly", label: "optimisation of every campaign" },
      { value: "Clear", label: "KPIs agreed before we start" },
    ],
    overview: {
      title: ["Every rupee ", "tracked and accounted for."],
      text: "We set up tracking before we spend, agree on what success looks like, and then test audiences, creatives and bids every week. You always know what you're paying and what it's bringing back.",
      points: [
        "Conversion tracking set up before launch",
        "Targets agreed for cost per lead or sale",
        "Weekly tests on audiences, ads and bids",
        "Campaigns run in accounts you own",
      ],
      image: img("performance-ads", "overview.jpg", "Ad performance dashboard on a laptop"),
    },
    deliverables: [
      { title: "Google Search & Display", text: "Show up when people are searching for exactly what you offer." },
      { title: "Meta ads", text: "Facebook and Instagram campaigns that reach the right audience." },
      { title: "YouTube ads", text: "Video campaigns for awareness and remarketing." },
      { title: "Ad creatives", text: "Static, carousel and video ads designed to be clicked." },
      { title: "Tracking setup", text: "GA4, pixels and conversion tracking so every rupee is measured." },
      { title: "Landing pages", text: "Focused pages that turn ad clicks into enquiries." },
    ],
    showcase: [
      { title: "Search campaigns", tag: "Google Ads", image: img("performance-ads", "work-1.jpg", "Google search results with an ad") },
      { title: "Creative sets", tag: "Meta Ads", image: img("performance-ads", "work-2.jpg", "Set of social ad creatives") },
      { title: "Landing pages", tag: "Conversion", image: img("performance-ads", "work-3.jpg", "Landing page with an enquiry form") },
    ],
    process: [
      { title: "Goals", text: "We agree on KPIs, budget and target cost per result." },
      { title: "Build", text: "Tracking, audiences, creatives and campaigns set up." },
      { title: "Optimise", text: "Weekly tests on audiences, ads and bids." },
      { title: "Report", text: "Transparent monthly reports on spend and results." },
    ],
    industries: ["Real estate", "Education", "Healthcare", "E-commerce", "Automobile", "Travel", "Finance", "Local services"],
    tools: ["Google Ads", "Meta Ads Manager", "GA4", "Google Tag Manager", "Looker Studio", "YouTube Ads"],
    faqs: [
      { q: "What budget do we need to start?", a: "It depends on your goals and market. We'll recommend a starting budget in your free consultation and scale what works." },
      { q: "Do you charge a percentage of ad spend?", a: "We offer custom packages for different budgets — talk to us and we'll suggest the right fit." },
      { q: "Who owns the ad accounts?", a: "You do. Campaigns run in your accounts, so all data stays with your business." },
    ],
    related: ["seo", "social-media", "web-design"],
    seo: {
      title: "Google & Meta Ads Agency in Kerala | Mindstory",
      description: "Performance marketing with Google Ads and Meta ads, built around clear KPIs. Mindstory, Thrissur & Kochi.",
    },
  },
  {
    slug: "seo",
    category: "growth",
    icon: "seo",
    title: "SEO",
    short: "Rank and get found",
    headline: ["Rank higher. ", "Get found first."],
    intro:
      "We dive deep into search to lift your visibility, drive organic traffic and turn Google into a steady source of customers — with ethical, long-term SEO.",
    highlights: [
      { value: "100%", label: "white-hat, long-term SEO" },
      { value: "Monthly", label: "ranking & traffic reports" },
      { value: "Local", label: "SEO for Kerala & the GCC" },
    ],
    overview: {
      title: ["Traffic that keeps coming, ", "month after month."],
      text: "Ads stop the moment you stop paying. SEO builds an asset that keeps working — a site Google trusts, content people search for, and local listings that put you on the map when customers nearby are looking.",
      points: [
        "Technical fixes that help Google crawl and rank you",
        "Content planned around real customer searches",
        "Google Business Profile tuned for local searches",
        "Honest monthly reports on rankings and leads",
      ],
      image: img("seo", "overview.jpg", "Search analytics charts on a monitor"),
    },
    deliverables: [
      { title: "Technical SEO audit", text: "Speed, indexing and site-health fixes that search engines reward." },
      { title: "Keyword research", text: "The searches your customers actually use — and how to win them." },
      { title: "On-page SEO", text: "Titles, content and structure optimised page by page." },
      { title: "Content marketing", text: "Blogs and landing pages that rank and convert." },
      { title: "Local SEO", text: "Google Business Profile and local listings to win nearby searches." },
      { title: "Link building", text: "Quality, relevant backlinks that build authority." },
    ],
    showcase: [
      { title: "Technical audits", tag: "Site health", image: img("seo", "work-1.jpg", "Website audit report") },
      { title: "Content hubs", tag: "Content", image: img("seo", "work-2.jpg", "Blog article layout") },
      { title: "Local listings", tag: "Local SEO", image: img("seo", "work-3.jpg", "Business listing on a map app") },
    ],
    process: [
      { title: "Audit", text: "Technical, content and competitor review." },
      { title: "Strategy", text: "Keyword plan and priorities for the next months." },
      { title: "Optimise", text: "Fixes, content and links rolled out every month." },
      { title: "Measure", text: "Rankings, traffic and leads reported monthly." },
    ],
    industries: ["Clinics & hospitals", "Education", "Real estate", "E-commerce", "Hotels & resorts", "Law & finance", "Local services", "B2B"],
    tools: ["Google Search Console", "GA4", "Ahrefs", "SEMrush", "Screaming Frog", "Google Business Profile"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "Most sites see meaningful movement in three to six months. SEO compounds — the gains keep building over time." },
      { q: "Can you guarantee #1 rankings?", a: "No honest agency can guarantee positions. We guarantee the work, transparent reporting and a clear plan to grow your visibility." },
      { q: "Do you write the content too?", a: "Yes. Our team writes SEO content and blogs, or optimises what you already have." },
    ],
    related: ["web-design", "performance-ads", "e-commerce"],
    seo: {
      title: "SEO Company in Thrissur & Kochi, Kerala | Mindstory",
      description: "Technical SEO, local SEO and content that ranks. Grow organic traffic with Mindstory, Kerala.",
    },
  },

  /* ─────────────── DIGITAL ─────────────── */
  {
    slug: "web-design",
    category: "digital",
    icon: "web",
    title: "Web design",
    short: "Fast, modern websites",
    headline: ["Websites that look great ", "and work harder."],
    intro:
      "Custom-designed, fast and mobile-first websites built to turn visitors into enquiries — with SEO foundations and an easy-to-edit CMS from day one.",
    highlights: [
      { value: "Mobile", label: "first design on every page" },
      { value: "SEO", label: "ready from launch" },
      { value: "Easy", label: "for your team to update" },
    ],
    overview: {
      title: ["Built for speed, ", "designed to convert."],
      text: "Your website is often the first real conversation a customer has with you. We design every page around what visitors need to decide, and build it to load fast on the phones most of them are using.",
      points: [
        "Custom design — no off-the-shelf templates",
        "Fast loading on mobile and slow networks",
        "Clear calls to action on every page",
        "A CMS your team can update without a developer",
      ],
      image: img("web-design", "overview.jpg", "Website design shown on a laptop and phone"),
    },
    deliverables: [
      { title: "UX & wireframes", text: "Page structure planned around what your visitors need." },
      { title: "Custom UI design", text: "A unique design that matches your brand — no templates." },
      { title: "Development", text: "Fast, secure builds with modern frameworks." },
      { title: "CMS setup", text: "Edit text, images and pages yourself without a developer." },
      { title: "SEO foundations", text: "Clean code, speed, metadata and analytics built in." },
      { title: "Care & support", text: "Hosting help, updates and improvements after launch." },
    ],
    showcase: [
      { title: "Homepage design", tag: "UI design", image: img("web-design", "work-1.jpg", "Website homepage design") },
      { title: "Mobile experience", tag: "Mobile", image: img("web-design", "work-2.jpg", "Website on a smartphone") },
      { title: "Easy-to-edit CMS", tag: "CMS", image: img("web-design", "work-3.jpg", "Content management dashboard") },
    ],
    process: [
      { title: "Plan", text: "Goals, sitemap and content planned together." },
      { title: "Design", text: "Wireframes and visual design you review and approve." },
      { title: "Build", text: "Development, CMS and testing on every device." },
      { title: "Launch", text: "Go live, training for your team and ongoing support." },
    ],
    industries: ["Corporate", "Startups", "Healthcare", "Education", "Real estate", "Hospitality", "NGOs", "Manufacturing"],
    tools: ["Figma", "Next.js", "WordPress", "Webflow", "Vercel", "GA4"],
    faqs: [
      { q: "How long does a website take?", a: "A typical business website takes four to eight weeks, depending on the number of pages and features." },
      { q: "Will we be able to edit the site ourselves?", a: "Yes. We set up a CMS and show your team how to update content." },
      { q: "Do you redesign existing websites?", a: "Yes — we can redesign while keeping your existing SEO value and URLs in mind." },
    ],
    related: ["seo", "e-commerce", "identity-design"],
    seo: {
      title: "Website Design & Development in Kerala | Mindstory",
      description: "Fast, modern, mobile-first websites designed and built by Mindstory, Thrissur & Kochi.",
    },
  },
  {
    slug: "e-commerce",
    category: "digital",
    icon: "ecommerce",
    title: "E-commerce",
    short: "Stores that convert",
    headline: ["Online stores that ", "sell while you sleep."],
    intro:
      "From store setup to product pages, payments and marketing, our dedicated e-commerce team builds and grows online stores that convert browsers into buyers.",
    highlights: [
      { value: "Dedicated", label: "e-commerce division since 2018" },
      { value: "End-to-end", label: "setup, launch and growth" },
      { value: "Secure", label: "payments and checkout" },
    ],
    overview: {
      title: ["Everything a store needs, ", "from catalogue to checkout."],
      text: "Selling online takes more than a nice storefront. We handle the platform, products, payments and shipping, then keep bringing shoppers back with ads, email and SEO — so your store grows after launch day.",
      points: [
        "Shopify, WooCommerce or a custom build",
        "Product pages that answer questions and sell",
        "Payments, shipping and taxes configured",
        "Marketing to grow repeat customers",
      ],
      image: img("e-commerce", "overview.jpg", "Online store shown on a laptop with products beside it"),
    },
    deliverables: [
      { title: "Store design", text: "A shopping experience designed around your products." },
      { title: "Platform setup", text: "Shopify, WooCommerce or custom — whichever fits you best." },
      { title: "Product pages", text: "Photos, copy and layouts that answer questions and sell." },
      { title: "Payments & shipping", text: "Payment gateways, delivery options and taxes configured." },
      { title: "Conversion optimisation", text: "Checkout and funnel improvements that lift sales." },
      { title: "Store marketing", text: "Ads, email and SEO to bring shoppers back again and again." },
    ],
    showcase: [
      { title: "Storefronts", tag: "Store design", image: img("e-commerce", "work-1.jpg", "Online storefront homepage") },
      { title: "Product pages", tag: "Product", image: img("e-commerce", "work-2.jpg", "Product detail page") },
      { title: "Checkout flows", tag: "Checkout", image: img("e-commerce", "work-3.jpg", "Mobile checkout screen") },
    ],
    process: [
      { title: "Plan", text: "Catalogue, platform and customer journey mapped out." },
      { title: "Build", text: "Store design, products, payments and shipping set up." },
      { title: "Launch", text: "Testing, go-live and launch campaign." },
      { title: "Grow", text: "Ongoing marketing and conversion improvements." },
    ],
    industries: ["Fashion", "Jewellery", "Spices & food", "Ayurveda & wellness", "Electronics", "Home décor", "Handicrafts", "Beauty"],
    tools: ["Shopify", "WooCommerce", "Razorpay", "Klaviyo", "Meta Commerce", "GA4"],
    faqs: [
      { q: "Which platform should we use?", a: "It depends on your catalogue, budget and growth plans — we'll recommend Shopify, WooCommerce or a custom build after a quick consultation." },
      { q: "Can you add products and manage the store for us?", a: "Yes. We can handle catalogue uploads and ongoing store management." },
      { q: "Do you help with marketing after launch?", a: "Yes — pair it with performance ads, SEO and social media to grow sales." },
    ],
    related: ["web-design", "performance-ads", "seo"],
    seo: {
      title: "E-commerce Website Development in Kerala | Mindstory",
      description: "Online stores that convert — design, setup and growth by Mindstory's dedicated e-commerce team.",
    },
  },
];

/* ── helpers ─────────────────────────────────────────────────────────── */

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const getServicesByCategory = (id: CategoryId) => services.filter((s) => s.category === id);

export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;

export const getRelated = (service: Service) =>
  service.related.map(getService).filter((s): s is Service => Boolean(s));

/**
 * Other names people (or old links) might use → the real slug.
 * /services/branding redirects to /services/identity-design, and so on.
 */
export const serviceAliases: Record<string, string> = {
  branding: "identity-design",
  "logo-identity": "identity-design",
  "logo-design": "identity-design",
  "art-illustration": "identity-design",
  strategy: "brand-strategy",
  video: "video-production",
  "social-media-marketing": "social-media",
  smm: "social-media",
  "digital-advertising": "performance-ads",
  ads: "performance-ads",
  ppc: "performance-ads",
  "search-engine-optimization": "seo",
  "web-development": "web-design",
  website: "web-design",
  ecommerce: "e-commerce",
};