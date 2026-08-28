/**
 * All page content lives here so the section components stay presentational.
 * Copy is taken verbatim from the design prototype, which in turn was written
 * from Indra's LinkedIn profile.
 */

/** First professional role — Universitas Dian Nuswantoro, January 2016. */
export const CAREER_START_YEAR = 2016;

/**
 * Whole years since CAREER_START_YEAR, resolved when the site is built rather than
 * written down. The figure was hard-coded as "7+" (carried over from a LinkedIn
 * summary written around 2023) and had drifted three years behind the timeline
 * directly below it.
 */
export const YEARS_EXPERIENCE = new Date().getFullYear() - CAREER_START_YEAR;

export const SITE = {
  name: 'Indra Kusuma',
  role: 'Fullstack Engineer · AI-Native',
  location: 'Jakarta, Indonesia',
  url: 'https://indrakusuma.web.id',
  email: 'id.indrakusuma@gmail.com',
  description: `${YEARS_EXPERIENCE}+ years building end-to-end — from top-traffic commerce frontends to Go services and AI-native tooling. Currently at ByteDance, previously Tokopedia.`,
} as const;

export type NavItem = { id: string; href: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', href: '#about', label: 'About' },
  { id: 'experience', href: '#experience', label: 'Experience' },
  { id: 'skills', href: '#skills', label: 'Skills' },
  { id: 'awards', href: '#awards', label: 'Awards' },
  { id: 'contact', href: '#contact', label: 'Contact' },
];

export type Stat = {
  value: string;
  label: string;
  /** Attribution line. Keep it short — the cards are narrow. */
  context: string;
};

/**
 * Four outcomes across four dimensions: reach, impact, scope, economics.
 *
 * Each figure is attributed on the card. An unqualified "100M+ users" is the most
 * discounted claim on an engineering portfolio; naming the surface is what makes it
 * land — and keeps every number defensible if someone asks about it in an interview.
 *
 * The reach figure is deliberately platform-level: Tokopedia and TikTok Shop each
 * exceed 100M monthly users, which is a statement about where the work shipped, not
 * a claim that any one module was touched by that many people.
 */
export const STATS: Stat[] = [
  { value: '100M+', label: 'Monthly users', context: 'Tokopedia & TikTok Shop' },
  // The timeline keeps the detailed LCP/p75 proof while this stat stays compact.
  { value: '3×', label: 'Faster page load', context: 'in Web Tiktok Seller Center' },
  // The stat highlights the named high-traffic surfaces while leaving room for
  // adjacent commerce work covered in the timeline below.
  { value: '6+', label: 'Core commerce surfaces', context: 'Homepage, Flash Sale, Checkout, and more' },
  { value: '4+', label: 'International teams', context: 'US, China, Singapore, India, and more' },
];

export type Role = {
  title: string;
  period: string;
  location: string;
  current?: boolean;
  points: string[];
};

export type Experience = {
  company: string;
  /**
   * Company mark, built from assets/logos/ by
   * scripts/prepare-company-logos.mjs.
   */
  logo: string;
  /** Drives the pulsing ring on the timeline badge. */
  isCurrent?: boolean;
  award?: string;
  roles: Role[];
};

export const EXPERIENCES: Experience[] = [
  {
    company: 'ByteDance',
    logo: '/logos/companies/bytedance.webp',
    isCurrent: true,
    award: 'GEC Spot Bonus · Q2 2024',
    roles: [
      {
        title: 'Senior Software Engineer, Frontend',
        period: 'Feb 2024 — Present',
        location: 'Jakarta, ID',
        current: true,
        points: [
          'Improved page performance by reducing LCP by 70% (10s → 3s at p75) on the ‘Manage Product’ page, one of the top-3 highest-traffic modules in TikTok Seller Center.',
          'Building scalable end-user interfaces using Lynx, focusing on native-like performance and cross-platform compatibility.',
          'Delivered end-user surfaces on TikTok Shop, including the Homepage and Flash Sale modules.',
          'Reduced engineering complexity by ~30% by developing internal tools that automated and simplified the migration of the Tokopedia Web Platform to the ByteDance ecosystem.',
        ],
      },
    ],
  },
  {
    company: 'Tokopedia',
    logo: '/logos/companies/tokopedia.webp',
    award: 'Focus on Consumer · Make it Happen',
    roles: [
      {
        title: 'Senior Software Engineer, Web Platform',
        period: 'Jan 2021 — Jan 2024',
        location: 'Jakarta',
        points: [
          'Led the Web Performance working group for Purchase Platform, Ops, Logistics and Fulfillment teams — testing, analyzing and driving improvements.',
          'Worked with Engineer Productivity to develop an in-house Data Tracker Validation.',
          'Collaborated with the Cloud Platform team to manage multiple services in the Tokopedia Web Platform.',
          'Core maintainer for the Tokopedia Seller Platform.',
        ],
      },
      {
        title: 'Software Engineer, Web Platform',
        period: 'Jul 2019 — Dec 2020',
        location: 'Jakarta',
        points: [
          'Delivered high-performance web experiences across Order History, Cart and Checkout modules.',
          'Ensured high-quality code with >75% test coverage.',
          'Monitored and optimized web performance using PageSpeed Insights and Lighthouse.',
        ],
      },
      {
        title: 'Software Engineer, Mobile Web',
        period: 'Nov 2018 — Jun 2019',
        location: 'Jakarta',
        points: [
          'Delivered high-performance web experiences across Cart, Checkout and Promo modules.',
          'Major projects: One-Click Checkout module, Cart Page revamp and Promo System revamp.',
        ],
      },
    ],
  },
  {
    company: 'Invitato',
    logo: '/logos/companies/invitato.webp',
    roles: [
      {
        title: 'Co-Founder & Tech Advisor',
        period: 'Oct 2021 — Now',
        location: 'Remote',
        points: [
          'Built the foundation for the Wedding Website Template.',
          'Built core foundations for Internal Tools, a Digital Guestbook App and a Client Dashboard App, enhancing the user experience.',
          'Optimized infrastructure using Firebase & Google Apps Script, reducing backend costs to $0 for Invitato apps.',
          'Provided technology guidance, mentoring, code reviews and knowledge-sharing sessions.',
        ],
      },
    ],
  },
  {
    company: 'Skill Academy by Ruangguru',
    logo: '/logos/companies/ruangguru.webp',
    roles: [
      {
        title: 'Course Instructor',
        period: 'Nov 2019 — Dec 2019',
        location: 'Jakarta',
        points: [
          'Collaborated with a SkillAcademy content analyst to create the HTML Basic curriculum.',
          'Taught HTML live using OBS (Open Broadcasting Software).',
        ],
      },
    ],
  },
  {
    company: 'Suara Merdeka Group',
    logo: '/logos/companies/suara-merdeka.webp',
    roles: [
      {
        title: 'Software Engineer',
        period: 'Sep 2017 — Sep 2018',
        location: 'Semarang',
        points: [
          'Worked closely under the CMO to prototype and develop innovative digital solutions.',
          'Developed and launched Android apps (Suara Merdeka & Kabar Kadin) on the Google Play Store, expanding digital reach.',
          'Built and maintained SuaraMerdeka.com, ensuring website performance and reliability.',
        ],
      },
    ],
  },
  {
    company: 'Universitas Dian Nuswantoro',
    logo: '/logos/companies/udinus.webp',
    roles: [
      {
        title: 'Web Developer — Career Center',
        period: 'Jan 2016 — Aug 2017',
        location: 'Semarang',
        points: [
          'Developed and maintained cc.dinus.ac.id, improving accessibility and engagement for students and alumni.',
          'Designed and implemented a new landing & registration page for offline Job Fair events, increasing attendee registration rates.',
        ],
      },
    ],
  },
];

export type SkillLogo = {
  /** simple-icons slug; also the filename under /logos/skills. */
  slug: string;
  name: string;
  desc: string;
  /**
   * Renders the name as text instead of a vendored mark. Set it only for a slug
   * simple-icons has no entry for — scripts/generate-icons.mjs fails the run if
   * this flag and simple-icons disagree in either direction, so it cannot go
   * stale silently.
   */
  wordmark?: true;
};

export type SkillRow = {
  /** -1 scrolls left, 1 scrolls right. */
  dir: -1 | 1;
  items: SkillLogo[];
};

export const SKILL_ROWS: SkillRow[] = [
  {
    dir: -1,
    items: [
      { slug: 'react', name: 'React', desc: 'UI library' },
      { slug: 'nextdotjs', name: 'Next.js', desc: 'React framework' },
      { slug: 'gatsby', name: 'Gatsby', desc: 'Static site gen' },
      { slug: 'vuedotjs', name: 'Vue.js', desc: 'UI framework' },
      { slug: 'typescript', name: 'TypeScript', desc: 'Typed JavaScript' },
      { slug: 'javascript', name: 'JavaScript', desc: 'Core language' },
      { slug: 'html5', name: 'HTML5', desc: 'Markup & semantics' },
      { slug: 'lynx', name: 'Lynx', desc: 'Cross-platform UI', wordmark: true },
    ],
  },
  {
    dir: 1,
    items: [
      { slug: 'go', name: 'Go', desc: 'Backend language' },
      { slug: 'nodedotjs', name: 'Node.js', desc: 'JS runtime' },
      { slug: 'php', name: 'PHP', desc: 'Backend language' },
      { slug: 'laravel', name: 'Laravel', desc: 'PHP framework' },
      { slug: 'mysql', name: 'MySQL', desc: 'Relational database' },
      { slug: 'supabase', name: 'Supabase', desc: 'Postgres backend' },
      { slug: 'firebase', name: 'Firebase', desc: 'Backend-as-a-Service' },
      { slug: 'docker', name: 'Docker', desc: 'Containers' },
    ],
  },
  {
    dir: -1,
    items: [
      { slug: 'bytedance', name: 'ByteDance', desc: 'Tech stack' },
      { slug: 'anthropic', name: 'Claude', desc: 'AI-native coding' },
      { slug: 'githubcopilot', name: 'Copilot', desc: 'AI code assistant' },
      { slug: 'githubactions', name: 'GitHub Actions', desc: 'CI / CD' },
      { slug: 'googlecloud', name: 'Google Cloud', desc: 'Cloud infra' },
      { slug: 'netlify', name: 'Netlify', desc: 'Deploy platform' },
      { slug: 'gitlab', name: 'GitLab', desc: 'Git & pipelines' },
      { slug: 'figma', name: 'Figma', desc: 'Design & handoff' },
    ],
  },
];

/** `year` drives the display order; the array order below is not significant. */
export type Award = { title: string; org: string; desc: string; year: number };

export const AWARDS: Award[] = [
  {
    title: 'GEC Spot Bonus Award',
    org: 'ByteDance · 2024',
    year: 2024,
    desc: 'Recognized for outstanding impact on TikTok Seller Center web performance.',
  },
  {
    title: 'Make it Happen, Make it Better',
    org: 'Tokopedia · 2021 & 2022',
    year: 2022,
    desc: 'Awarded twice for shipping high-impact platform improvements end to end.',
  },
  {
    title: 'Focus on Consumer',
    org: 'Tokopedia · 2019 & 2021',
    year: 2021,
    desc: 'Honored for consistently putting customer experience first in delivery.',
  },
  {
    title: '1st Place — Startup Business',
    org: 'UDINUS Competition · 2017',
    year: 2017,
    desc: 'Won the university-wide startup competition with an original product concept.',
  },
  {
    title: '2nd Place — Startup Prototype',
    org: 'Creativepreneur Festival · 2016',
    year: 2016,
    desc: 'Runner-up for Markir, a QR-code parking-payment prototype (PoC).',
  },
  {
    title: 'Best Graduate & PKM Research Grant',
    org: 'Academic Honors · 2017',
    year: 2017,
    desc: 'Top graduate recognition plus a funded student research project (automatic fish feeder).',
  },
];

export type SocialLink = { href: string; label: string; title: string };

export const SOCIALS: SocialLink[] = [
  { href: `mailto:${SITE.email}`, label: 'Email', title: SITE.email },
  { href: 'https://www.linkedin.com/in/idindrakusuma', label: 'LinkedIn', title: 'LinkedIn' },
  { href: 'https://x.com/idindrakusuma', label: 'X', title: 'X' },
  { href: 'https://github.com/idindrakusuma', label: 'GitHub', title: 'GitHub' },
];
