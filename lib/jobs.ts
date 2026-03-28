import { IMAGES } from "./constants";

export type JobType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Remote"
  | "Internship";
export type ExperienceLevel =
  | "Entry Level"
  | "Mid Level"
  | "Senior"
  | "Lead"
  | "Director";

export interface Job {
  id: number;
  slug: string;
  company_name: string;
  company_logo: string;
  job_title: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  category: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posted_days_ago: number;
  deadline: string;
  applicants: number;
  is_featured: boolean;
  is_remote: boolean;
}

export const categoryColors: Record<string, string> = {
  Design: "#FFB836",
  Business: "#4640DE",
  Technology: "#FF6550",
  Marketing: "#56CDAD",
  Finance: "#26A4FF",
  Healthcare: "#56CDAD",
  Engineering: "#FF6550",
  Sales: "#FFB836",
};

export const ALL_JOBS: Job[] = [
  {
    id: 1,
    slug: "email-marketing-revolut",
    company_name: "Revolut",
    company_logo: IMAGES.COMPANY_LOGO_1,
    job_title: "Email Marketing Specialist",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "Madrid, Spain",
    salary_min: 60000,
    salary_max: 80000,
    salary_currency: "USD",
    category: ["Marketing", "Design"],
    description:
      "Revolut is looking for an Email Marketing Specialist to help the team manage marketing campaigns and improve customer engagement across global markets.",
    responsibilities: [
      "Develop and execute email marketing campaigns",
      "Analyze campaign performance and optimize for conversions",
      "Collaborate with design team on email templates",
      "Manage subscriber list segmentation",
    ],
    requirements: [
      "3+ years of email marketing experience",
      "Proficiency with marketing automation tools",
      "Strong analytical and data-driven mindset",
      "Excellent written communication skills",
    ],
    benefits: [
      "Remote Friendly",
      "Health Insurance",
      "Learning Budget",
      "Flexible Hours",
    ],
    posted_days_ago: 2,
    deadline: "Apr 15, 2026",
    applicants: 142,
    is_featured: true,
    is_remote: false,
  },
  {
    id: 2,
    slug: "brand-designer-dropbox",
    company_name: "Dropbox",
    company_logo: IMAGES.COMPANY_LOGO_2,
    job_title: "Brand Designer",
    jobType: "Full Time",
    experienceLevel: "Senior",
    location: "San Francisco, US",
    salary_min: 110000,
    salary_max: 140000,
    salary_currency: "USD",
    category: ["Design"],
    description:
      "Dropbox is looking for a Brand Designer to help the team build a strong visual identity and create engaging brand experiences for millions of users worldwide.",
    responsibilities: [
      "Define and evolve the Dropbox brand visual language",
      "Create compelling marketing and product design assets",
      "Partner with cross-functional teams on campaigns",
      "Maintain brand consistency across all touchpoints",
    ],
    requirements: [
      "5+ years in brand or graphic design",
      "Expert in Figma, Illustrator, and Photoshop",
      "Strong portfolio demonstrating brand work",
      "Experience at a tech company preferred",
    ],
    benefits: [
      "Equity Package",
      "Remote Friendly",
      "Health Insurance",
      "Flexible Hours",
      "Learning Budget",
    ],
    posted_days_ago: 5,
    deadline: "Apr 30, 2026",
    applicants: 89,
    is_featured: true,
    is_remote: true,
  },
  {
    id: 3,
    slug: "product-manager-pitch",
    company_name: "Pitch",
    company_logo: IMAGES.COMPANY_LOGO_3,
    job_title: "Product Manager",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "Berlin, Germany",
    salary_min: 85000,
    salary_max: 110000,
    salary_currency: "EUR",
    category: ["Technology", "Business"],
    description:
      "Pitch is looking for a Product Manager to define product vision and work closely with engineering and design to bring impactful features to market.",
    responsibilities: [
      "Define product strategy and roadmap",
      "Work with engineering on feature specs and delivery",
      "Gather and prioritize user feedback",
      "Define and track key product metrics",
    ],
    requirements: [
      "3+ years in product management",
      "Strong analytical and problem-solving skills",
      "Experience with agile development workflows",
      "Excellent communication and stakeholder management",
    ],
    benefits: [
      "Equity Package",
      "Health Insurance",
      "Flexible Hours",
      "Remote Friendly",
    ],
    posted_days_ago: 3,
    deadline: "Apr 20, 2026",
    applicants: 214,
    is_featured: true,
    is_remote: false,
  },
  {
    id: 4,
    slug: "visual-designer-blinklist",
    company_name: "Blinklist",
    company_logo: IMAGES.COMPANY_LOGO_2,
    job_title: "Visual Designer",
    jobType: "Full Time",
    experienceLevel: "Entry Level",
    location: "Granada, Spain",
    salary_min: 45000,
    salary_max: 60000,
    salary_currency: "EUR",
    category: ["Design"],
    description:
      "Blinklist is looking for a Visual Designer to help the design team create beautiful and user-friendly experiences for our growing user base.",
    responsibilities: [
      "Create UI components and design assets",
      "Collaborate with product team on new features",
      "Maintain design system and style guides",
      "Prototype and test new design concepts",
    ],
    requirements: [
      "1-2 years in visual or UI design",
      "Proficiency in Figma",
      "Good eye for typography and layout",
      "Portfolio showcasing visual design work",
    ],
    benefits: ["Flexible Hours", "Learning Budget", "Health Insurance"],
    posted_days_ago: 7,
    deadline: "May 1, 2026",
    applicants: 67,
    is_featured: false,
    is_remote: false,
  },
  {
    id: 5,
    slug: "product-designer-classpass",
    company_name: "ClassPass",
    company_logo: IMAGES.COMPANY_LOGO_1,
    job_title: "Senior Product Designer",
    jobType: "Full Time",
    experienceLevel: "Senior",
    location: "Manchester, UK",
    salary_min: 95000,
    salary_max: 120000,
    salary_currency: "GBP",
    category: ["Design", "Marketing"],
    description:
      "ClassPass is looking for a Senior Product Designer to help design intuitive and modern digital products for users worldwide.",
    responsibilities: [
      "Lead design for key product areas",
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and specs",
      "Mentor junior designers on the team",
    ],
    requirements: [
      "5+ years in product design",
      "Strong portfolio with mobile and web work",
      "Experience with user research methods",
      "Proficiency in Figma and design systems",
    ],
    benefits: [
      "Equity Package",
      "Flexible Hours",
      "Remote Friendly",
      "Health Insurance",
      "Learning Budget",
    ],
    posted_days_ago: 1,
    deadline: "May 15, 2026",
    applicants: 178,
    is_featured: true,
    is_remote: true,
  },
  {
    id: 6,
    slug: "lead-designer-canva",
    company_name: "Canva",
    company_logo: IMAGES.COMPANY_LOGO_3,
    job_title: "Lead Designer",
    jobType: "Full Time",
    experienceLevel: "Lead",
    location: "Ontario, Canada",
    salary_min: 130000,
    salary_max: 160000,
    salary_currency: "CAD",
    category: ["Design", "Technology"],
    description:
      "Canva is looking for a Lead Designer to help lead design initiatives, build a world-class design team, and improve product experiences at scale.",
    responsibilities: [
      "Lead a team of 6-10 product designers",
      "Define design direction and standards",
      "Partner with PMs and engineers on major initiatives",
      "Champion design quality across the organization",
    ],
    requirements: [
      "7+ years in design with 2+ years of leadership",
      "Experience growing and managing design teams",
      "Strong systems thinking and design strategy",
      "Excellent communication with executives",
    ],
    benefits: [
      "Equity Package",
      "Remote Friendly",
      "Health Insurance",
      "Flexible Hours",
      "Learning Budget",
    ],
    posted_days_ago: 4,
    deadline: "May 10, 2026",
    applicants: 56,
    is_featured: true,
    is_remote: true,
  },
  {
    id: 7,
    slug: "brand-strategist-godaddy",
    company_name: "GoDaddy",
    company_logo: IMAGES.COMPANY_LOGO_1,
    job_title: "Brand Strategist",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "Marseille, France",
    salary_min: 70000,
    salary_max: 90000,
    salary_currency: "EUR",
    category: ["Business", "Marketing"],
    description:
      "GoDaddy is looking for a Brand Strategist to help strengthen brand positioning and develop impactful strategies for global markets.",
    responsibilities: [
      "Define brand positioning and messaging frameworks",
      "Work with creative teams on campaign development",
      "Analyze brand performance metrics",
      "Lead competitive and market research",
    ],
    requirements: [
      "4+ years in brand strategy",
      "Strong analytical and storytelling skills",
      "Experience with global brands",
      "MBA or equivalent is a plus",
    ],
    benefits: ["Health Insurance", "Flexible Hours", "Learning Budget"],
    posted_days_ago: 9,
    deadline: "Apr 25, 2026",
    applicants: 44,
    is_featured: false,
    is_remote: false,
  },
  {
    id: 8,
    slug: "data-analyst-twitter",
    company_name: "Twitter",
    company_logo: IMAGES.COMPANY_LOGO_2,
    job_title: "Data Analyst",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "San Diego, US",
    salary_min: 95000,
    salary_max: 125000,
    salary_currency: "USD",
    category: ["Technology", "Marketing"],
    description:
      "Twitter is looking for a Data Analyst to help the team analyze user data and provide insights to improve platform engagement.",
    responsibilities: [
      "Build and maintain dashboards and reports",
      "Analyze user behavior and product metrics",
      "Partner with product and engineering teams",
      "Develop data models and ETL processes",
    ],
    requirements: [
      "3+ years in data analytics",
      "Proficiency in SQL and Python",
      "Experience with BI tools (Tableau, Looker)",
      "Strong statistical analysis skills",
    ],
    benefits: [
      "Remote Friendly",
      "Health Insurance",
      "Flexible Hours",
      "Equity Package",
    ],
    posted_days_ago: 6,
    deadline: "May 5, 2026",
    applicants: 203,
    is_featured: false,
    is_remote: true,
  },
  {
    id: 9,
    slug: "frontend-engineer-stripe",
    company_name: "Stripe",
    company_logo: IMAGES.COMPANY_LOGO_3,
    job_title: "Senior Frontend Engineer",
    jobType: "Full Time",
    experienceLevel: "Senior",
    location: "Dublin, Ireland",
    salary_min: 120000,
    salary_max: 160000,
    salary_currency: "EUR",
    category: ["Technology", "Engineering"],
    description:
      "Stripe is looking for a Senior Frontend Engineer to build beautiful, performant, and accessible web experiences used by millions of businesses worldwide.",
    responsibilities: [
      "Build and maintain core frontend infrastructure",
      "Collaborate with designers to implement pixel-perfect UIs",
      "Improve performance and accessibility standards",
      "Mentor junior and mid-level engineers",
    ],
    requirements: [
      "5+ years with React and TypeScript",
      "Deep knowledge of web performance optimization",
      "Experience with design systems",
      "Strong testing practices",
    ],
    benefits: [
      "Equity Package",
      "Remote Friendly",
      "Health Insurance",
      "Flexible Hours",
      "Learning Budget",
    ],
    posted_days_ago: 2,
    deadline: "May 20, 2026",
    applicants: 312,
    is_featured: true,
    is_remote: true,
  },
  {
    id: 10,
    slug: "growth-manager-notion",
    company_name: "Notion",
    company_logo: IMAGES.COMPANY_LOGO_1,
    job_title: "Growth Manager",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "San Francisco, US",
    salary_min: 90000,
    salary_max: 120000,
    salary_currency: "USD",
    category: ["Marketing", "Business"],
    description:
      "Notion is looking for a Growth Manager to drive user acquisition and retention through data-driven experiments and scalable growth strategies.",
    responsibilities: [
      "Design and run A/B tests on growth loops",
      "Analyze funnel metrics and identify bottlenecks",
      "Collaborate with product and design on growth features",
      "Report on growth KPIs to leadership",
    ],
    requirements: [
      "3+ years in growth or product marketing",
      "Strong experimentation and analytics mindset",
      "Experience with growth tools (Amplitude, Mixpanel)",
      "Excellent cross-functional collaboration skills",
    ],
    benefits: [
      "Remote Friendly",
      "Equity Package",
      "Health Insurance",
      "Flexible Hours",
    ],
    posted_days_ago: 8,
    deadline: "Apr 28, 2026",
    applicants: 156,
    is_featured: false,
    is_remote: true,
  },
  {
    id: 11,
    slug: "ux-researcher-figma",
    company_name: "Figma",
    company_logo: IMAGES.COMPANY_LOGO_2,
    job_title: "UX Researcher",
    jobType: "Full Time",
    experienceLevel: "Mid Level",
    location: "New York, US",
    salary_min: 100000,
    salary_max: 130000,
    salary_currency: "USD",
    category: ["Design", "Technology"],
    description:
      "Figma is hiring a UX Researcher to help us deeply understand our users and translate insights into product improvements.",
    responsibilities: [
      "Plan and conduct qualitative and quantitative research",
      "Synthesize findings and share with stakeholders",
      "Champion the voice of the user in product decisions",
      "Develop research operations and documentation",
    ],
    requirements: [
      "3+ years in UX or product research",
      "Mixed-methods research expertise",
      "Strong workshop facilitation skills",
      "Excellent written and verbal communication",
    ],
    benefits: [
      "Equity Package",
      "Remote Friendly",
      "Health Insurance",
      "Learning Budget",
    ],
    posted_days_ago: 3,
    deadline: "May 12, 2026",
    applicants: 88,
    is_featured: false,
    is_remote: false,
  },
  {
    id: 12,
    slug: "backend-engineer-linear",
    company_name: "Linear",
    company_logo: IMAGES.COMPANY_LOGO_3,
    job_title: "Backend Engineer",
    jobType: "Remote",
    experienceLevel: "Senior",
    location: "Remote, Worldwide",
    salary_min: 130000,
    salary_max: 180000,
    salary_currency: "USD",
    category: ["Technology", "Engineering"],
    description:
      "Linear is looking for a Backend Engineer to help build the fastest and most reliable project management software on the planet.",
    responsibilities: [
      "Design and build scalable backend services",
      "Improve API performance and reliability",
      "Collaborate with product on new features",
      "Write clean, well-tested code",
    ],
    requirements: [
      "5+ years with Node.js or similar",
      "Deep understanding of distributed systems",
      "Experience with PostgreSQL",
      "Strong focus on code quality and testing",
    ],
    benefits: [
      "Remote Friendly",
      "Equity Package",
      "Health Insurance",
      "Flexible Hours",
      "Learning Budget",
    ],
    posted_days_ago: 1,
    deadline: "Jun 1, 2026",
    applicants: 267,
    is_featured: true,
    is_remote: true,
  },
];

export const CATEGORIES = [
  { name: "Design", count: 235, icon: "🎨", color: "#FFB836" },
  { name: "Business", count: 103, icon: "💼", color: "#4640DE" },
  { name: "Technology", count: 438, icon: "💻", color: "#FF6550" },
  { name: "Marketing", count: 312, icon: "📣", color: "#56CDAD" },
  { name: "Finance", count: 89, icon: "💰", color: "#26A4FF" },
  { name: "Engineering", count: 564, icon: "⚙️", color: "#FF6550" },
  { name: "Healthcare", count: 67, icon: "🏥", color: "#56CDAD" },
  { name: "Sales", count: 193, icon: "🤝", color: "#FFB836" },
];
