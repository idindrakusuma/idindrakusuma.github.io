/**
 * All page content lives here so the section components stay presentational.
 * Copy is taken verbatim from the design prototype, which in turn was written
 * from Indra's LinkedIn profile.
 */

export const SITE = {
  name: 'Indra Kusuma',
  role: 'Fullstack Engineer · AI-Native',
  location: 'Jakarta, Indonesia',
  url: 'https://indrakusuma.web.id',
  email: 'id.indrakusuma@gmail.com',
  description:
    '7+ years building end-to-end — from top-traffic commerce frontends to Go services and AI-native tooling. Currently at ByteDance, previously Tokopedia.',
} as const;

export type NavItem = { id: string; href: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', href: '#about', label: 'About' },
  { id: 'experience', href: '#experience', label: 'Experience' },
  { id: 'skills', href: '#skills', label: 'Skills' },
  { id: 'awards', href: '#awards', label: 'Awards' },
  { id: 'contact', href: '#contact', label: 'Contact' },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: '7+', label: 'Years building for the web' },
  { value: '70%', label: 'LCP cut on TikTok Seller Center' },
  { value: '5+', label: 'Product companies shipped for' },
  { value: '$0', label: 'Infra cost via serverless design' },
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
  /** Fallback initials, shown if the logo file is missing. */
  badge: string;
  /**
   * Company mark. Real logos come from assets/logos/ via
   * scripts/prepare-company-logos.mjs; the rest are initials placeholders from
   * scripts/generate-company-logos.mjs until real assets land.
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
    badge: 'BD',
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
          'Reduced engineering complexity by ~30% by developing internal tools that automated and simplified the migration of the Tokopedia Web Platform to the ByteDance ecosystem.',
        ],
      },
    ],
  },
  {
    company: 'Tokopedia',
    badge: 'TP',
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
    badge: 'IN',
    logo: '/logos/companies/invitato.svg',
    roles: [
      {
        title: 'Co-Founder & Tech Advisor',
        period: 'Oct 2021 — Now',
        location: 'Remote',
        current: true,
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
    badge: 'SA',
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
    badge: 'SM',
    logo: '/logos/companies/suara-merdeka.svg',
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
    badge: 'UD',
    logo: '/logos/companies/dinus.svg',
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
};

export type SkillRow = {
  /** -1 scrolls left, 1 scrolls right. */
  dir: -1 | 1;
  items: SkillLogo[];
};

/** Slugs with no simple-icons entry render as a text wordmark instead. */
export const SKILL_LOGOS_WITHOUT_ICON = new Set(['lynx']);

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
      { slug: 'lynx', name: 'Lynx', desc: 'Cross-platform UI' },
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

export type Award = { title: string; org: string; desc: string };

export const AWARDS: Award[] = [
  {
    title: 'GEC Spot Bonus Award',
    org: 'ByteDance · 2024',
    desc: 'Recognized for outstanding impact on TikTok Seller Center web performance.',
  },
  {
    title: 'Make it Happen, Make it Better',
    org: 'Tokopedia · 2021 & 2022',
    desc: 'Awarded twice for shipping high-impact platform improvements end to end.',
  },
  {
    title: 'Focus on Consumer',
    org: 'Tokopedia · 2019 & 2021',
    desc: 'Honored for consistently putting customer experience first in delivery.',
  },
  {
    title: '1st Place — Startup Business',
    org: 'UDINUS Competition',
    desc: 'Won the university-wide startup competition with an original product concept.',
  },
  {
    title: '2nd Place — Startup Prototype',
    org: 'Creativepreneur Festival · 2016',
    desc: 'Runner-up for Markir, a QR-code parking-payment prototype (PoC).',
  },
  {
    title: 'Best Graduate & PKM Research Grant',
    org: 'Academic Honors',
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
