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
  url: 'https://indrakusuma.dev',
  email: 'hi@indrakusuma.dev',
  description: `${YEARS_EXPERIENCE}+ years building end-to-end — from top-traffic commerce frontends to Go services and AI-native tooling. Currently at ByteDance, previously Tokopedia.`,
} as const;

export type Section = { id: string; label: string };

/**
 * The homepage's Sections, in the order they appear.
 *
 * This is the ordering authority: it numbers the Sections and it tells the
 * scroll spy what to watch. The nav renders one entry per Section today, and the
 * link is derived from the id rather than stored — a Section's href is `#id` on
 * the homepage and `/#id` anywhere else, which is not a fact about the Section.
 *
 * A nav entry that is a route rather than a Section (a Blog link, say) does not
 * belong in this list. Adding one here would renumber the Sections after it.
 */
export const SECTIONS: Section[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
];

/**
 * A Section's position in the page, zero-padded — "01" for the first.
 *
 * Derived from SECTIONS rather than written on each Section, which is where the
 * numbers used to live: five string literals renumbered by hand whenever the
 * order changed. An unknown id is a build failure, not a "00".
 */
export function sectionNumber(id: string): string {
  const index = SECTIONS.findIndex((section) => section.id === id);
  if (index === -1) throw new Error(`sectionNumber: "${id}" is not in SECTIONS`);
  return String(index + 1).padStart(2, '0');
}

/**
 * A nav entry is either a Section on the homepage or a route of its own.
 *
 * Kept apart from SECTIONS deliberately: SECTIONS numbers the page, so a route
 * added here — Blog — must not be able to renumber the Sections after it. The
 * Section variant carries no href because it depends on where you are, `#id` on
 * the homepage and `/#id` anywhere else.
 */
export type NavItem =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'route'; id: string; label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  ...SECTIONS.map((section): NavItem => ({ kind: 'section', id: section.id, label: section.label })),
  { kind: 'route', id: 'blog', label: 'Blog', href: '/blog' },
  { kind: 'route', id: 'projects', label: 'Projects', href: '/projects' },
];

/**
 * Built outside employment, owned by Indra alone, and live today — see Project
 * in CONTEXT.md. Work for an employer belongs in EXPERIENCES instead.
 *
 * The name is the product's own and stays untranslated; the description is
 * written in the site's English whatever language the product speaks.
 */
export type Project = {
  /** Its address under /projects — `/projects/{slug}`. */
  slug: string;
  name: string;
  /** One line: what it is. Shown on the card and atop the detail. */
  description: string;
  /** Why it exists, one paragraph per entry. */
  background: string[];
  /** When work began, as an ISO date. */
  created: string;
  /** What it is built from — what ships to the visitor. */
  stack: string[];
  /** What it was built with — none of it ships. */
  tools: string[];
  href: string;
  repo?: string;
  /** 1200×630 — the product's own social card, so it reads as the product. */
  image: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'taman-bermain',
    name: 'Taman Bermain',
    description:
      'Simple web games for young kids — cheerful, touch-first, and playable right in a phone browser.',
    background: [
      'My three-year-old son used to protest every time it was time to wash hands or brush teeth: what for? To get rid of the germs, I said. Back came the question: “So where are the germs?”',
      'Fair point — you can’t see them 😅 So I built a game where you can: Pemburu Kuman, where you chase cute germs away with the camera while washing hands and brushing teeth. One game led to another, and Taman Bermain is where they all live now.',
    ],
    created: '2026-10-08',
    stack: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'Web Audio', 'Web Speech', 'MediaPipe', 'PWA', 'Vercel'],
    tools: ['Claude Code', 'Playwright', 'ffmpeg'],
    href: 'https://mini-games.indrakusuma.dev',
    repo: 'https://github.com/idindrakusuma/mini-games',
    image: '/images/projects/taman-bermain.webp',
  },
];

/** The Project at `/projects/{slug}`, or undefined when there is none. */
export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

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
  { value: '100M+', label: 'Monthly platform users', context: 'Tokopedia & TikTok Shop' },
  // The timeline keeps the detailed LCP/p75 proof while this stat stays compact.
  { value: '3×', label: 'Faster page load', context: 'Manage Product, TikTok Seller Center' },
  // The stat highlights the named high-traffic surfaces while leaving room for
  // adjacent commerce work covered in the timeline below.
  { value: '6+', label: 'Core commerce modules', context: 'Homepage, Flash Sale, Cart, Checkout, and more' },
  { value: '4+', label: 'International teams', context: 'US, China, Singapore, India, and more' },
];

export type Role = {
  title: string;
  period: string;
  /**
   * Employment type, shown as a badge beside the title. Left out for
   * full-time roles, which is the default a reader assumes.
   */
  type?: 'Part-time' | 'Freelance';
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
        location: 'Jakarta',
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
        type: 'Part-time',
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
        type: 'Freelance',
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
        type: 'Part-time',
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
        type: 'Part-time',
        location: 'Semarang',
        points: [
          'Developed and maintained cc.dinus.ac.id, improving accessibility and engagement for students and alumni.',
          'Designed and implemented a new landing & registration page for offline Job Fair events, increasing attendee registration rates.',
        ],
      },
    ],
  },
];

/**
 * One area of ownership in Section 03 — what the work actually is, and the stack
 * behind it. The chips name tools; the blurb is what they were used to own.
 */
export type Capability = { name: string; blurb: string; items: string[] };

export const CAPABILITIES: Capability[] = [
  {
    name: 'Frontend at scale',
    blurb: 'Own high-traffic React surfaces end to end — architecture, state, and the performance budget.',
    items: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Lynx', 'ReactLynx', 'React Native · Expo'],
  },
  {
    name: 'Backend & data',
    blurb: 'Build and maintain the services behind them, from API design to schema and query performance.',
    items: ['Go', 'Node.js', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase'],
  },
  {
    name: 'Performance',
    blurb: 'Diagnose and fix Core Web Vitals — led a cross-team perf working group at Tokopedia.',
    items: ['Core Web Vitals', 'INP', 'Lighthouse', 'Perfsee', 'Profiling', 'Caching'],
  },
  {
    name: 'Developer experience',
    blurb: 'Own the toolchain a team lives in daily — bundling, tests and lint that stay fast as the codebase grows.',
    items: ['Vite', 'Rspack', 'webpack', 'Vitest', 'Playwright', 'Testing Library', 'ESLint', 'oxlint'],
  },
  {
    name: 'Infrastructure & delivery',
    blurb: 'Ship it and keep it up — containers, CI pipelines, and the edge and cloud it runs on.',
    items: ['Docker', 'GitHub Actions', 'Google Cloud', 'Cloudflare', 'Netlify'],
  },
  {
    name: 'AI-native delivery',
    blurb: 'Ship faster with agentic tooling in the loop — and the judgement for where it doesn’t belong.',
    items: ['Claude Code', 'Codex', 'Copilot', 'MCP', 'Agentic workflows'],
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
    title: 'PKM Research Grant & Outstanding Student Candidate',
    org: 'Academic Honors · 2017',
    year: 2017,
    desc: 'Funded student research project (automatic fish feeder) and nominated for Mahasiswa Berprestasi.',
  },
  {
    title: 'Best Graduate',
    org: 'SMK Muhammadiyah 03 Weleri · 2014',
    year: 2014,
    desc: 'Graduated as the top student of my class at vocational high school.',
  },
];

export type SocialLink = { href: string; label: string; title: string };

export const SOCIALS: SocialLink[] = [
  { href: `mailto:${SITE.email}`, label: 'Email', title: SITE.email },
  { href: 'https://www.linkedin.com/in/idindrakusuma', label: 'LinkedIn', title: 'LinkedIn' },
  { href: 'https://github.com/idindrakusuma', label: 'GitHub', title: 'GitHub' },
];
