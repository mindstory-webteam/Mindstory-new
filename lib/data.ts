// All copy & links sourced from the current mindstory.in homepage.

const WP = "https://mindstory.in/wp-content/uploads";

export const site = {
  name: "Mindstory",
  phone: "+91-8281001410",
  phoneHref: "tel:+918281001410",
  whatsapp: "https://wa.me/+918281001410",
  email: "hello@mindstory.in",
  hours: "Mon–Fri · 10AM to 6PM",
  proposal: "https://mindstory.in/growth-marketing/",
  socials: [
    { label: "Instagram", href: "https://instagram.com/mindstorian" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/68608253/" },
    { label: "Facebook", href: "https://facebook.com/mindstorian" },
    { label: "X / Twitter", href: "https://twitter.com/mindstorian" },
    { label: "Behance", href: "https://www.behance.net/mindstorycreative" },
  ],
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: NavItem[] = [
  {
    label: "About",
    href: "https://mindstory.in/about/",
    children: [
      { label: "About Us", href: "https://mindstory.in/about/" },
      { label: "Our Approach", href: "https://mindstory.in/our-approach/" },
      { label: "Pricing Options", href: "https://mindstory.in/pricing/" },
      { label: "Our Clients", href: "https://mindstory.in/clients/" },
      { label: "Client Feedback", href: "https://mindstory.in/testimonials/" },
    ],
  },
  {
    label: "Services",
    href: "https://mindstory.in/services/",
    children: [
      { label: "Web Design", href: "https://mindstory.in/web-development/" },
      { label: "E-Commerce", href: "https://mindstory.in/e-commerce-website/" },
      { label: "Digital Marketing", href: "https://mindstory.in/digital-advertising/" },
      { label: "Performance Marketing", href: "https://mindstory.in/performance-marketing-agency/" },
      { label: "SEO", href: "https://mindstory.in/search-engine-optimization/" },
      { label: "Social Media Marketing", href: "https://mindstory.in/social-media-marketing/" },
      { label: "Email Marketing", href: "https://mindstory.in/email-marketing/" },
      { label: "Visual Production", href: "https://mindstory.in/Visual-Production/" },
      { label: "Logo & Identity", href: "https://mindstory.in/logo-identity/" },
      { label: "Creative Design", href: "https://mindstory.in/creative-design/" },
      { label: "Art & Illustration", href: "https://mindstory.in/art-illustration/" },
      { label: "Business Advertising", href: "https://mindstory.in/business-and-advertising/" },
    ],
  },
  { label: "Works", href: "https://mindstory.in/case-studies/" },
  { label: "Learn", href: "https://mindstory.in/blog/" },
  { label: "Careers", href: "https://mindstory.in/career/" },
  { label: "Contact", href: "https://mindstory.in/contact-us/" },
];

export const services = [
  {
    title: "Ranking your site #1 on Google",
    tag: "SEO",
    body: "We dive deep into search algorithms to lift your visibility, drive organic traffic and lead your business to digital prominence.",
    href: "https://mindstory.in/search-engine-optimization/",
  },
  {
    title: "Social media brand boost",
    tag: "Social Media",
    body: "Targeted strategies that raise engagement, grow visibility and strengthen community so your brand's voice resonates on every platform.",
    href: "https://mindstory.in/social-media-marketing/",
  },
  {
    title: "Digital ad strategy for impact",
    tag: "Performance Ads",
    body: "A data-driven approach that optimises placements so your message reaches — and moves — exactly the right audience.",
    href: "https://mindstory.in/digital-advertising/",
  },
  {
    title: "Custom web design that stands out",
    tag: "Web Development",
    body: "Creativity meets functionality: websites that captivate visitors and communicate your brand's essence with clarity.",
    href: "https://mindstory.in/web-development/",
  },
  {
    title: "Brand enhancement with art & illustration",
    tag: "Branding",
    body: "Logo, identity and illustration with creative flair, so your brand makes an unforgettable impression in a crowded market.",
    href: "https://mindstory.in/art-illustration/",
  },
  {
    title: "Driving engagement with email",
    tag: "Email Marketing",
    body: "Compelling visuals and strategic messaging that spark meaningful interactions and keep your audience connected.",
    href: "https://mindstory.in/email-marketing/",
  },
];

export const caseStudies = [
  { name: "Kairali Ford", cat: "Automotive", img: `${WP}/ford-jpg-388x260.webp`, href: "https://mindstory.in/project-view/kairali-ford/", text: "Focused digital strategy that sustained and grew dealership demand." },
  { name: "Spais", cat: "Brand Growth", img: `${WP}/spais_mindstory-jpg-388x260.webp`, href: "https://mindstory.in/project-view/spais/", text: "A thoughtful marketing strategy that elevated a strong brand further." },
  { name: "Inker Robotics", cat: "Events & Design", img: `${WP}/Inker-Robotics-jpg-388x260.webp`, href: "https://mindstory.in/project-view/inker-robotics/", text: "End-to-end design and digital push behind a standout exhibition." },
  { name: "Wincentre", cat: "Education", img: `${WP}/Wincentre-jpg-388x260.webp`, href: "https://mindstory.in/project-view/wincentre/", text: "Broadening online reach for a leading education brand." },
  { name: "Indel Money", cat: "Finance", img: `${WP}/indel-money-case-study-1-jpg-388x260.webp`, href: "https://mindstory.in/project-view/indel-money-limited/", text: "Significant gains in online visibility for a growing NBFC." },
  { name: "Gold's Gym", cat: "Fitness", img: `${WP}/golds-gym-case-study-jpg-388x260.webp`, href: "https://mindstory.in/project-view/golds-gym/", text: "Local digital campaigns that filled the Kuriachira floor." },
  { name: "Chemmanur Credits", cat: "Finance", img: `${WP}/boche-chemmanur-jpg-388x260.webp`, href: "https://mindstory.in/project-view/chemmanur-credits-and-investments-limited/", text: "Expanding digital footprint for an established investments brand." },
  { name: "Motory", cat: "Social Media", img: `${WP}/MTRY_6-388x260.png`, href: "https://mindstory.in/project-view/motory/", text: "Strategic social media management that amplified presence." },
];

export const clients = [
  "SPAIS", "Eduexint", "Inspire Education", "CNGenius", "Feji", "Meledath Family", "Escaso",
  "Chai Peedika", "Manappuram Assets", "Woody's Brooke", "Sanystar", "Nimeyah", "Louis Philippe",
  "Vital Jobs", "Indel Suzuki",
];

export const reviews = [
  { name: "Marketing Cochin", text: "Exceptional experience with Mindstory! Their team delivered outstanding results, increasing our online visibility and driving significant growth in leads and sales." },
  { name: "Alaka Bhanumati", text: "A unique service that aligns with your brand at a really reasonable price. I have never been disappointed and would recommend them to anyone looking to take their business to the next level." },
  { name: "Jerin K S", text: "If you are looking for a digital marketing, branding, or creative consultancy, Mindstory is the place you want to go. Quick, with great designs." },
  { name: "Nivedhya C A", text: "Logo and branding services of Mindstory are awesome. They gave my brand a new identity." },
  { name: "Reefa John", text: "Brand logo by Mindstory is just superb. My logo is getting so many compliments." },
  { name: "Ayna Praharshan", text: "Mindstory's creative design is just top-notch. Brought my vision to reality." },
  { name: "Aiswarya K A", text: "Mindstory does very good work. They are affordable and professional." },
  { name: "Shereena K S", text: "I'm happy with Mindstory services. They're quick and provide great designs for my business." },
];

export const blogs = [
  { title: "Personal AI agents are visiting your website", tag: "AI & SEO", img: `${WP}/Personal-AI-Agents-Visiting-Websites.webp`, href: "https://mindstory.in/personal-ai-agents/" },
  { title: "Gemini UTM tracking: uncover hidden direct traffic in GA4", tag: "Analytics", img: `${WP}/digital-marketing-updates.webp`, href: "https://mindstory.in/gemini-utm-tracking/" },
  { title: "How to clean fake traffic in GA4", tag: "Analytics", img: `${WP}/how-to-clean-fake-traffic-in-ga4.webp`, href: "https://mindstory.in/how-to-clean-fake-traffic-in-ga4/" },
];

export const faqs = [
  { q: "What services does Mindstory offer?", a: "Full-stack digital solutions: SEO, digital marketing, visual production, branding, social media, email marketing, PPC advertising and web development." },
  { q: "How does Mindstory align digital strategies with a brand's identity?", a: "Through thorough brand analysis and an understanding of your mission and vision, we build strategies that reflect your unique identity and market position." },
  { q: "Do you offer branding and design services?", a: "Yes. Logo design, brand identity, graphic design and digital storytelling to make your brand visually memorable." },
  { q: "How do you measure the success of your campaigns?", a: "We track every campaign against clear, data-driven KPIs and share them with you transparently." },
  { q: "Do I need digital marketing if my business already gets referrals?", a: "Yes — digital marketing helps you reach a wider audience and builds a sustainable presence beyond word-of-mouth." },
  { q: "How much does digital marketing cost?", a: "It depends on your goals, ad budget and the services you need. We offer customised packages for small businesses and large enterprises alike." },
  { q: "How does Mindstory improve social media presence?", a: "Social strategy, creative design, content posting, influencer marketing and ad campaigns — all working together to lift engagement." },
  { q: "How do you handle ongoing support and reporting?", a: "A dedicated manager ensures daily communication, monthly performance reports and frequent strategy reviews." },
  { q: "What makes Mindstory the best digital marketing agency in Kerala?", a: "10+ years of experience, data-driven strategies, transparent reporting and a dedication to measurable results." },
  { q: "How do I get started with Mindstory?", a: "Reach out through the website or call us — we'll arrange a free consultation and design a strategy tailored to you." },
];
