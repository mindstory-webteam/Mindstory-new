// ─────────────────────────────────────────────
//  Blog data — swap this for a CMS / API later.
//  `cover` is optional: if you add an image at
//  /public/images/blog/<file>, set cover: "/images/blog/<file>"
// ─────────────────────────────────────────────

export const BLOG_CATEGORIES = ["All", "AI & SEO", "Analytics", "Social Media", "Performance Ads", "Branding"];

export const BLOGS = [
  {
    slug: "personal-ai-agents",
    title: "Personal AI agents are visiting your website",
    category: "AI & SEO",
    date: "2026-10-28",
    readTime: 6,
    author: { name: "Team Mindstory", role: "SEO Desk" },
    cover: null,
    featured: true,
    excerpt:
      "AI assistants now browse, compare and even book on behalf of users. Here's how to make sure your site is readable — and recommendable — to them.",
    content: [
      { type: "p", text: "A growing share of your visitors aren't people. They're AI assistants running errands for people — reading your pricing page, comparing you with three competitors and summarising the result in a single answer. If your site isn't easy for them to understand, you simply don't make the shortlist." },
      { type: "h2", text: "What an AI agent actually looks at" },
      { type: "p", text: "Agents behave like a very fast, very literal reader. They favour clean HTML, clear headings, structured data and pages that answer one question well. Heavy scripts, content hidden behind tabs and vague copy all make your page harder to parse." },
      { type: "list", items: ["Clear page titles and H1s that say exactly what the page offers", "Schema markup for organisation, products, services and FAQs", "Prices, locations and opening hours written as plain text", "Fast server-rendered pages that don't depend on client-side JS to show content"] },
      { type: "h2", text: "Write for answers, not just keywords" },
      { type: "p", text: "Agents pull short, factual passages to build their responses. Pages that state the answer in the first two sentences — then expand — tend to get quoted more often. Think FAQ-style sections, comparison tables and concise service summaries." },
      { type: "quote", text: "If a human could skim your page in ten seconds and know what you do, where and for how much, an AI agent can too." },
      { type: "h2", text: "Where to start this week" },
      { type: "list", items: ["Audit your top 10 landing pages for a one-line answer at the top", "Add FAQ and LocalBusiness schema", "Check your robots.txt isn't blocking legitimate AI crawlers you want", "Track referrals from AI assistants separately in GA4"] },
      { type: "p", text: "The brands that adapt early will be the ones AI assistants recommend by default. The good news: almost everything that helps agents also helps your human visitors." },
    ],
  },
  {
    slug: "gemini-utm-tracking",
    title: "Gemini UTM tracking: uncover hidden direct traffic in GA4",
    category: "Analytics",
    date: "2026-10-12",
    readTime: 5,
    author: { name: "Team Mindstory", role: "Analytics" },
    cover: null,
    featured: false,
    excerpt:
      "Traffic from AI chat tools often lands in GA4 as 'Direct'. A simple UTM and channel-grouping setup can bring it back into view.",
    content: [
      { type: "p", text: "When someone clicks a link inside an AI chat, the referrer is frequently stripped. GA4 then files that session under Direct — and a meaningful channel quietly disappears from your reports." },
      { type: "h2", text: "Why it matters" },
      { type: "p", text: "If AI assistants are sending you qualified visitors, you want to know which pages they land on and whether they convert. Without that data you can't decide where to invest content effort." },
      { type: "h2", text: "A practical setup" },
      { type: "list", items: ["Create a custom channel group in GA4 called 'AI Assistants'", "Match known AI referrer domains with a regex rule", "Use UTM-tagged links anywhere you control the URL (profiles, listings, shared docs)", "Compare landing pages for Direct vs AI Assistants month over month"] },
      { type: "quote", text: "You can't optimise a channel you can't see." },
      { type: "p", text: "It takes about twenty minutes to set up and gives you a far more honest picture of where growth is really coming from." },
    ],
  },
  {
    slug: "how-to-clean-fake-traffic-in-ga4",
    title: "How to clean fake traffic in GA4",
    category: "Analytics",
    date: "2026-09-30",
    readTime: 7,
    author: { name: "Team Mindstory", role: "Analytics" },
    cover: null,
    featured: false,
    excerpt:
      "Bot spikes and spam referrals distort every metric you report on. Here's a step-by-step way to filter them out of GA4.",
    content: [
      { type: "p", text: "A sudden traffic jump with 0-second sessions, a single city and a 100% bounce is rarely good news. It's usually bots — and it skews conversion rate, engagement and every decision built on them." },
      { type: "h2", text: "Spot the pattern first" },
      { type: "list", items: ["Unusual spikes from one city or one device type", "Engagement time close to zero", "Strange hostnames or referral domains", "Landing pages that don't exist on your site"] },
      { type: "h2", text: "Filter it out" },
      { type: "p", text: "Use GA4's data filters to exclude internal and developer traffic, list unwanted referrals in your tag settings, and build a comparison segment that removes suspicious sessions so you can report on clean data while you investigate." },
      { type: "quote", text: "Clean data won't make your numbers bigger — it makes them true." },
      { type: "p", text: "Review your filters every quarter. Bot patterns change, and a filter that worked last year may be letting new noise through." },
    ],
  },
  {
    slug: "instagram-reels-strategy-for-local-brands",
    title: "A Reels strategy that works for local brands",
    category: "Social Media",
    date: "2026-09-14",
    readTime: 5,
    author: { name: "Team Mindstory", role: "Social" },
    cover: null,
    featured: false,
    excerpt:
      "You don't need a film crew. A repeatable format, a hook in the first second and a consistent schedule do most of the work.",
    content: [
      { type: "p", text: "Local brands win on Reels when they feel local — real staff, real places, real customers. Polished ads tend to get scrolled past; honest, specific content gets saved and shared." },
      { type: "h2", text: "Pick three repeatable formats" },
      { type: "list", items: ["Behind the scenes: how something is made or prepared", "Customer questions answered in under 20 seconds", "Before / after or transformation clips"] },
      { type: "h2", text: "Hook, value, call to action" },
      { type: "p", text: "Open with the outcome, deliver one useful idea, then close with a single clear next step — visit, call or DM. Keep text on screen for people watching on mute." },
      { type: "quote", text: "Consistency beats virality. Four good Reels a week will outgrow one lucky hit." },
    ],
  },
  {
    slug: "google-ads-budget-for-small-business",
    title: "How much should a small business spend on Google Ads?",
    category: "Performance Ads",
    date: "2026-08-26",
    readTime: 6,
    author: { name: "Team Mindstory", role: "Performance" },
    cover: null,
    featured: false,
    excerpt:
      "Start from what a customer is worth to you, not from a random monthly number. Here's a simple way to set a budget that pays for itself.",
    content: [
      { type: "p", text: "The right budget is the one that buys enough clicks to learn what converts, while keeping your cost per lead below what a customer is worth." },
      { type: "h2", text: "Work backwards from value" },
      { type: "list", items: ["Average revenue per customer", "Your typical lead-to-customer rate", "Maximum you can pay per lead and still profit", "Average cost per click in your category and city"] },
      { type: "p", text: "Multiply out and you have a starting budget grounded in your own economics rather than a guess." },
      { type: "h2", text: "Give it time to learn" },
      { type: "p", text: "Run a focused campaign for four to six weeks before judging it. Cut what doesn't convert, double down on search terms that do, and keep a close eye on negative keywords." },
      { type: "quote", text: "A smaller, tightly targeted campaign almost always beats a big, broad one." },
    ],
  },
  {
    slug: "brand-identity-checklist",
    title: "The brand identity checklist before you launch",
    category: "Branding",
    date: "2026-08-08",
    readTime: 4,
    author: { name: "Team Mindstory", role: "Creative" },
    cover: null,
    featured: false,
    excerpt:
      "A logo isn't a brand. Run through this checklist so your identity holds up across every screen, sign and post.",
    content: [
      { type: "p", text: "Most brand problems show up after launch — a logo that disappears at small sizes, colours that clash on print, or a tone that changes from post to post." },
      { type: "h2", text: "The essentials" },
      { type: "list", items: ["Primary and secondary logo, plus an icon version", "A colour palette with exact values for screen and print", "Two typefaces at most, with clear usage rules", "Tone-of-voice notes with do / don't examples", "Templates for social posts, presentations and documents"] },
      { type: "quote", text: "A consistent brand looks bigger than it is." },
      { type: "p", text: "Put it all into a short brand guide and share it with everyone who creates content for you — in-house or outside." },
    ],
  },
];

export function getBlogBySlug(slug) {
  return BLOGS.find((b) => b.slug === slug) || null;
}

export function getRelatedBlogs(slug, limit = 3) {
  const current = getBlogBySlug(slug);
  if (!current) return BLOGS.slice(0, limit);
  const same = BLOGS.filter((b) => b.slug !== slug && b.category === current.category);
  const rest = BLOGS.filter((b) => b.slug !== slug && b.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
