// ─────────────────────────────────────────────
//  Team members for the "Meet the team" grid.
//  Photos live in /public/images/team/ (square, ~400×400, face centred).
//  The member-XX.svg files are illustrated DUMMY portraits — swap each
//  `image` for a real photo (e.g. "/images/team/arjun.jpg") when ready.
//  Leave `image` out and an orange initials avatar is shown instead.
//  ⚠ Dummy names/roles — replace with your real team.
// ─────────────────────────────────────────────

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  /** optional link (LinkedIn, Behance…) opened when the face is clicked */
  href?: string;
};

const img = (n: number) => `/images/team/member-${String(n).padStart(2, "0")}.svg`;

export const TEAM: TeamMember[] = [
  { name: "Arjun Menon", role: "Founder & CEO", image: img(1) },
  { name: "Neha Varghese", role: "Head of Strategy", image: img(2) },
  { name: "Rahul Nair", role: "Creative Director", image: img(3) },
  { name: "Anjali Pillai", role: "SEO Lead", image: img(4) },
  { name: "Vivek Krishnan", role: "Performance Marketing Lead", image: img(5) },
  { name: "Sneha Thomas", role: "Social Media Manager", image: img(6) },
  { name: "Akhil Raj", role: "Senior Graphic Designer", image: img(7) },
  { name: "Meera Suresh", role: "Video Editor", image: img(8) },
  { name: "Joel Mathew", role: "Content Writer", image: img(9) },
  { name: "Divya Mohan", role: "Frontend Developer", image: img(10) },
  { name: "Nikhil Das", role: "Account Manager", image: img(11) },
  { name: "Aparna Ravi", role: "Motion Designer", image: img(12) },
  { name: "Sanjay Kumar", role: "SEO Executive", image: img(13) },
  { name: "Riya Joseph", role: "Media Buyer", image: img(14) },
  { name: "Gokul Prasad", role: "Copywriter", image: img(15) },
  { name: "Fathima Rasheed", role: "UI/UX Designer", image: img(16) },
  { name: "Kiran Babu", role: "Photographer", image: img(17) },
  { name: "Aswathy Unni", role: "Social Media Executive", image: img(18) },
  { name: "Abhishek Shaji", role: "Graphic Designer", image: img(19) },
  { name: "Lakshmi Hari", role: "Web Developer", image: img(20) },
  { name: "Ashwin George", role: "Client Servicing", image: img(21) },
  { name: "Nimisha Paul", role: "Analytics Specialist", image: img(22) },
  { name: "Sreejith Vijayan", role: "Brand Strategist", image: img(23) },
  { name: "Gayathri Nambiar", role: "Email Marketing Specialist", image: img(24) },
  { name: "Adarsh Kurian", role: "3D & Motion Artist", image: img(25) },
  { name: "Hiba Salim", role: "Community Manager", image: img(26) },
  { name: "Midhun Chacko", role: "Backend Developer", image: img(27) },
  { name: "Parvathy Sasi", role: "Project Manager", image: img(28) },
  { name: "Rohan Antony", role: "Cinematographer", image: img(29) },
  { name: "Keerthana Babu", role: "Illustrator", image: img(30) },
  { name: "Vishnu Prakash", role: "PPC Specialist", image: img(31) },
  { name: "Ann Maria Jose", role: "Influencer Marketing", image: img(32) },
  { name: "Sharath Chandran", role: "Business Development", image: img(33) },
  { name: "Athira Gopal", role: "HR & Culture", image: img(34) },
  { name: "Marketing Intern", role: "Marketing Intern", image: img(35) },
  { name: "Design Intern", role: "Design Intern", image: img(36) },
];
