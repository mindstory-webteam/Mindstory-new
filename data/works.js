// ─────────────────────────────────────────────
//  Case studies — edit here.
//  `types` / `industry` power the filters on /works
//  (and the navbar links /works?type=… /works?industry=…).
//  Images are the thumbnails from mindstory.in — swap in larger
//  versions (or files in /public/images/works/) when you have them.
//  `results` are written qualitatively: replace with your real numbers.
// ─────────────────────────────────────────────

const IMG = "https://mindstory.in/wp-content/uploads";

export const WORK_TYPES = [
  { id: "branding", label: "Branding" },
  { id: "campaigns", label: "Campaigns" },
  { id: "web", label: "Websites" },
  { id: "video", label: "Video" },
  { id: "social", label: "Social Media" },
  { id: "seo", label: "SEO" },
];

export const INDUSTRIES = [
  { id: "automotive", label: "Automotive" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "fitness", label: "Fitness" },
  { id: "events", label: "Events & Exhibitions" },
  { id: "lifestyle", label: "Lifestyle & Retail" },
];

export const WORKS = [
  {
    slug: "kairali-ford",
    client: "Kairali Ford",
    title: "Keeping a car dealership's showroom busy",
    tagline: "Focused digital strategy that sustained and grew dealership demand.",
    category: "Automotive",
    industry: "automotive",
    types: ["campaigns", "social"],
    services: ["Performance Ads", "Social Media", "Lead Generation"],
    location: "Kerala",
    image: `${IMG}/ford-jpg-388x260.webp`,
    featured: true,
    challenge:
      "Car buyers research for weeks before they visit a showroom. The dealership needed to stay visible through that whole journey and turn online interest into test drives and walk-ins.",
    approach: [
      "Mapped the buying journey from first search to showroom visit",
      "Ran model-specific search and social campaigns timed to launches and offers",
      "Built simple lead forms and fast follow-up with the sales team",
      "Kept an always-on social presence around new arrivals and deliveries",
    ],
    delivered: ["Google Search & Performance Max", "Meta lead campaigns", "Monthly content calendar", "Offer creatives", "Lead tracking & reporting"],
    results: [
      "A steady flow of enquiries between big launch moments",
      "Clear reporting on which models and offers drove leads",
      "A stronger local social presence for the brand",
    ],
  },
  {
    slug: "spais",
    client: "Spais",
    title: "Taking a strong brand even further",
    tagline: "A thoughtful marketing strategy that elevated a strong brand further.",
    category: "Brand Growth",
    industry: "lifestyle",
    types: ["branding", "social", "campaigns"],
    services: ["Brand Strategy", "Social Media", "Creative Design"],
    location: "Kerala",
    image: `${IMG}/spais_mindstory-jpg-388x260.webp`,
    featured: false,
    challenge:
      "Spais already had a loyal following. The goal was to grow without losing what made the brand special — a consistent look and voice across every channel.",
    approach: [
      "Brand audit to define tone, visual rules and key messages",
      "Content pillars that balanced product, people and story",
      "Campaign creatives designed to work across feed, stories and print",
    ],
    delivered: ["Brand guidelines", "Social media management", "Campaign creatives", "Photo & video direction"],
    results: [
      "A recognisable, consistent brand across every touchpoint",
      "Higher-quality engagement from the right audience",
      "A content system the team can keep using",
    ],
  },
  {
    slug: "inker-robotics",
    client: "Inker Robotics",
    title: "Making an exhibition impossible to miss",
    tagline: "End-to-end design and digital push behind a standout exhibition.",
    category: "Events & Design",
    industry: "events",
    types: ["branding", "campaigns", "video"],
    services: ["Event Branding", "Creative Design", "Digital Promotion"],
    location: "Kerala",
    image: `${IMG}/Inker-Robotics-jpg-388x260.webp`,
    featured: false,
    challenge:
      "A robotics exhibition had to attract students, parents and educators — and give them a reason to come, register and share it.",
    approach: [
      "One visual identity for every banner, stand and post",
      "Pre-event teasers and registration-focused ads",
      "On-ground coverage turned into same-day social content",
    ],
    delivered: ["Event identity", "Print & stage design", "Promo videos", "Registration campaigns", "Live coverage"],
    results: [
      "A cohesive look from the first teaser to the last day",
      "Strong awareness ahead of the event",
      "A library of content to reuse for future editions",
    ],
  },
  {
    slug: "wincentre",
    client: "Wincentre",
    title: "Broadening reach for a leading education brand",
    tagline: "Broadening online reach for a leading education brand.",
    category: "Education",
    industry: "education",
    types: ["campaigns", "seo", "social"],
    services: ["SEO", "Performance Ads", "Social Media"],
    location: "Kerala",
    image: `${IMG}/Wincentre-jpg-388x260.webp`,
    featured: false,
    challenge:
      "Admissions run on tight seasons. Wincentre needed to reach students and parents at the right time and make enquiring as easy as possible.",
    approach: [
      "Course-level landing pages and search campaigns for admission season",
      "Student success stories as social content",
      "Local SEO for every centre",
    ],
    delivered: ["Search campaigns", "Landing pages", "Local SEO", "Social media content"],
    results: [
      "Wider online reach across target districts",
      "More enquiries during admission windows",
      "Better visibility for each centre in local search",
    ],
  },
  {
    slug: "indel-money",
    client: "Indel Money",
    title: "Digital visibility for a growing NBFC",
    tagline: "Significant gains in online visibility for a growing NBFC.",
    category: "Finance",
    industry: "finance",
    types: ["campaigns", "seo", "video"],
    services: ["Digital Campaigns", "SEO", "Video Production"],
    location: "Kerala",
    image: `${IMG}/indel-money-case-study-1-jpg-388x260.webp`,
    featured: true,
    challenge:
      "Financial brands need trust before anything else. Indel Money wanted to grow its digital presence — including campaigns for its public NCD issues — while staying clear and compliant.",
    approach: [
      "Complete digital marketing for the public NCD issue",
      "Trust-led creatives and explainer videos",
      "Search and social campaigns targeted by region",
      "SEO to grow branded and product search",
    ],
    delivered: ["NCD campaign strategy", "Explainer videos", "Search & social ads", "SEO", "Reporting"],
    results: [
      "Significant gains in online visibility",
      "Campaign support across multiple public NCD issues",
      "A consistent, trustworthy digital voice",
    ],
  },
  {
    slug: "golds-gym",
    client: "Gold's Gym",
    title: "Filling the floor at Kuriachira",
    tagline: "Local digital campaigns that filled the Kuriachira floor.",
    category: "Fitness",
    industry: "fitness",
    types: ["campaigns", "social", "video"],
    services: ["Local Campaigns", "Social Media", "Reels"],
    location: "Thrissur",
    image: `${IMG}/golds-gym-case-study-jpg-388x260.webp`,
    featured: false,
    challenge:
      "A gym's audience lives within a few kilometres. The goal was to reach that neighbourhood and turn interest into trial visits and memberships.",
    approach: [
      "Hyper-local targeting around the Kuriachira branch",
      "Trainer and member Reels to show the real gym",
      "Offer-led campaigns around new-year and seasonal peaks",
    ],
    delivered: ["Local Meta campaigns", "Reels & short videos", "Offer creatives", "Lead follow-up flow"],
    results: [
      "More walk-ins and trial sign-ups from the local area",
      "An authentic social presence members share",
      "Campaigns that can be repeated every season",
    ],
  },
  {
    slug: "chemmanur-credits",
    client: "Chemmanur Credits",
    title: "Expanding an established investments brand online",
    tagline: "Expanding digital footprint for an established investments brand.",
    category: "Finance",
    industry: "finance",
    types: ["campaigns", "social", "web"],
    services: ["Digital Strategy", "Social Media", "Web"],
    location: "Kerala",
    image: `${IMG}/boche-chemmanur-jpg-388x260.webp`,
    featured: false,
    challenge:
      "A well-known name offline needed the same strength online — clear information, steady content and campaigns that build confidence.",
    approach: [
      "Digital strategy built around trust and clarity",
      "Regular social content explaining products simply",
      "Website improvements for faster, clearer enquiries",
    ],
    delivered: ["Digital strategy", "Social media management", "Campaign creatives", "Website updates"],
    results: [
      "A larger, more active digital footprint",
      "Clearer product communication online",
      "Smoother enquiry journey on the website",
    ],
  },
  {
    slug: "motory",
    client: "Motory",
    title: "Social media that amplified presence",
    tagline: "Strategic social media management that amplified presence.",
    category: "Social Media",
    industry: "automotive",
    types: ["social", "video", "branding"],
    services: ["Social Media Management", "Content Creation"],
    location: "GCC",
    image: `${IMG}/MTRY_6-388x260.png`,
    featured: false,
    challenge:
      "Motory needed a social presence that matched its ambitions — consistent, recognisable and engaging for its audience.",
    approach: [
      "Defined a visual style and posting rhythm",
      "Mixed educational, product and community content",
      "Monthly reviews to double down on what performed",
    ],
    delivered: ["Social strategy", "Content calendar", "Creatives & videos", "Community management"],
    results: [
      "A stronger, more consistent social presence",
      "Content formats the audience engages with",
      "A repeatable monthly content system",
    ],
  },
];

export const getWork = (slug) => WORKS.find((w) => w.slug === slug) || null;
export const typeLabel = (id) => WORK_TYPES.find((t) => t.id === id)?.label || id;
export const industryLabel = (id) => INDUSTRIES.find((i) => i.id === id)?.label || id;
