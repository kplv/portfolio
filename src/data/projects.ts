import { converter, formatCss } from 'culori';

export interface TeamMember {
  name: string;
  avatar: string;
  href: string;
}

export type MediaBlock =
  | { type: 'image'; src: string; alt?: string; cover?: boolean }
  | { type: 'video'; src: string; poster?: string; loop?: boolean; cover?: boolean };

export interface SectionItem {
  label?: string;
  media: MediaBlock;
  /** Spans full width in single-column layout (reserved for future 2-col grid) */
  fullWidth?: boolean;
}

export interface ProjectSection {
  title: string;
  items: SectionItem[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  /** Short tagline shown on the project card */
  description: string;
  /** Longer intro text shown in the project modal header */
  intro?: string;
  image: string;
  /** When provided, cycles through these instead of single image. */
  images?: string[];
  /** Accent color in OKLCH; derived from last color of accentGradient when not set */
  accentColor?: string;
  /** When provided, used for modal header and home overlay; accentColor used for other UI */
  accentGradient?: string;
  team?: TeamMember[];
  role?: string;
  year?: string;
  contribution?: string;
  sections?: ProjectSection[];
}

const toOklch = converter('oklch');

/** Last color from gradient (hex, rgb, or oklch), converted to OKLCH */
function lastColorFromGradientInOklch(gradient: string): string | undefined {
  const colorRegex = /#[0-9a-fA-F]{3,8}|rgb\s*\([^)]+\)|oklch\s*\([^)]+\)/g;
  const matches = gradient.match(colorRegex);
  if (!matches?.length) return undefined;
  const last = matches[matches.length - 1];
  const parsed = toOklch(last);
  return parsed ? formatCss(parsed) : undefined;
}

/** Resolved accent color in OKLCH: explicit accentColor, or last color from accentGradient, or fallback */
export function getAccentColor(
  project: Project,
  fallback = 'var(--mint-400)',
): string {
  return (
    project.accentColor ??
    (project.accentGradient
      ? lastColorFromGradientInOklch(project.accentGradient)
      : undefined) ??
    fallback
  );
}

/** Gradient for headers: accentGradient when present, else fallback from accentColor */
export function getHeaderGradient(project: Project): string {
  if (project.accentGradient) return project.accentGradient;
  const color = getAccentColor(project);
  return `linear-gradient(90deg, ${color} 0%, ${color} 100%)`;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ostrom',
    name: 'Ostrom',
    description: 'An expat-friendly energy app and Germany\'s first virtual power plant',
    intro:
      'Berlin-based energy startup with an expat-friendly mobile app and Germany\u2019s first virtual power plant. Raised \u20ac\u00a020M in Series B funding.',
    image: '/images/projects/ostrom/ostrom-1.png',
    images: [
      '/images/projects/ostrom/ostrom-1.png',
      '/images/projects/ostrom/ostrom-2.png',
      '/images/projects/ostrom/ostrom-3.png',
    ],
    accentColor: 'oklch(70% 0.1 186)',
    accentGradient:
      'radial-gradient(circle at 50% 85% in oklch, oklch(0.8 0.1 202) 0%, oklch(0.7 0.1 186) 100%)',
    role: 'Sr. Product Designer',
    year: '2025–26',
    contribution: 'Product Design, Frontend',
    team: [],
    sections: [
      {
        title: 'Features',
        items: [
          {
            label: 'New Energy Graph. Here\u2019s customers could check what\u2019s happening around their household in real-time.',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-1.png',
            },
          },
          {
            label: 'Solar System Insights. One place to assess how self-sufficient customer setup is.',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-2.png',
            },
          },
          {
            label: 'Charging Statistics. A holistics overview of spendings and savings when charging at home.',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-3.png',
            },
            fullWidth: true,
          },
          {
            label: 'Almost all new features were built in code first by me. We had a proper hand-off with specifications and also code prototypes.',
            media: {
              type: 'video',
              src: '/images/projects/ostrom/ostrom-5.mp4',
              cover: true
            },
          },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'trade-republic',
    name: 'Trade Republic',
    description:
      'Fraud prevention, delightful interactions, and employee tools for Europe\'s largest savings platform',
    intro:
      'Trade Republic is Europe\u2019s largest savings platform, with over 8\u00a0million users. I joined the design team as a product designer in 2023. My main contribution was developing financial crime solutions from scratch (0\u00a0\u2192\u00a01), which helped save customers hundreds of thousands of euros. I also launched a new internal performance review service that streamlined the process and helped retain top talent.',
    image: '/images/projects/trade/trade-0.png',
    images: [
      '/images/projects/trade/trade-0.png',
      '/images/projects/trade/trade-1.png',
      '/images/projects/trade/trade-4.png',
      '/images/projects/trade/trade-5.png',
      '/images/projects/trade/trade-6.png',
    ],
    accentColor: 'oklch(55% 0.05 237)',
    accentGradient:
      'linear-gradient(to right top, oklch(0.55 0.05 237) 0%, oklch(0.4 0.15 265) 100%)',
    role: 'Product Designer II',
    year: '2023–24',
    contribution: 'Product & Interactive Design',
    team: [],
    sections: [
      {
        title: 'Features',
        items: [
          {
            label: 'Source of Income. A new feature where we ask customers to declare their earnings.',
            media: { type: 'image', src: '/images/projects/trade/trade-1.png', cover: true },
          },
          {
            label: 'Micro-interactions and Joy. I initiated a project to make the most-used flows more enjoyable, like the money transfer screen.',
            media: { type: 'video', src: '/images/projects/trade/trade-2.mp4', cover: true },
          },
          {
            label: 'We also thought about gracefully handling different corner-cases.',
            media: { type: 'video', src: '/images/projects/trade/trade-3.mp4', cover: true },
          },
          {
            label: 'Blocked Account. A new feature where the customer can still use the app while we investigate. Previously, we would block the entire app login.',
            media: { type: 'image', src: '/images/projects/trade/trade-4.png', cover: true },
          },
          {
            label: 'Recurrent Diligence. A new feature for keeping customer data up to date.',
            media: { type: 'image', src: '/images/projects/trade/trade-5.png', cover: true },
          },
          {
            label: 'New Performance Review App. I also contributed to internal tools, helping everyone stay aligned on the company\u2019s strategy.',
            media: { type: 'image', src: '/images/projects/trade/trade-6.png', cover: true },
          },
        ],
      },
    ],
  },
];
