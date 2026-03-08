import { converter, formatCss } from 'culori';

export interface TeamMember {
  name: string;
  avatar: string;
  href: string;
}

export type MediaBlock =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; poster?: string; loop?: boolean };

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
    description: 'Mobile app for managing your home energy and the first virtual power plant in Germany.',
    intro:
      'Energy start-up from Berlin with expat friendly mobile application and the first virtual power plant in Germany. Series B with € 30 millions market evaluation.',
    image: '/images/projects/ostrom/ostrom-1.png',
    images: [
      '/images/projects/ostrom/ostrom-1.png',
      '/images/projects/ostrom/ostrom-2.png',
      '/images/projects/ostrom/ostrom-3.png',
      '/images/projects/ostrom/ostrom-4.png',
    ],
    accentColor: 'oklch(70% 0.1 186)',
    accentGradient:
      'radial-gradient(farthest-corner circle at 50% 85% in oklch, oklch(95% 0.29 158) 0%, oklch(70% 0.1 186) 100%)',
    role: 'Sr. Product Designer',
    year: '2025–26',
    contribution: 'Product Design, Frontend',
    team: [{ name: 'Denis Kopylov', avatar: '/images/team/denis.jpg', href: '' }],
    sections: [
      {
        title: 'Features',
        items: [
          {
            label: 'Live Energy Graph',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-1.png',
            },
          },
          {
            label: 'Solar System Insights',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-2.png',
            },
          },
          {
            label: 'Charging Statistics',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-3.png',
            },
            fullWidth: true,
          },
          {
            label: 'Daily Charging Sessions',
            media: {
              type: 'image',
              src: '/images/projects/ostrom/ostrom-4.png',
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
      "Worked on security and delight features for EU's largest broker.",
    intro:
      'European investing service used by 4M+ investors across 17 markets to trade stocks, ETFs, derivatives, and crypto. Worked on security and delight features.',
    image: '/images/projects/trade/trade-1.png',
    images: ['/images/projects/trade/trade-1.png'],
    accentColor: 'oklch(55% 0.05 237)',
    accentGradient:
      'linear-gradient(to bottom left in oklab, oklch(55% 0.05 237) 0%, oklch(17% 0.09 315) 100%)',
    role: 'Product Designer II',
    year: '2024–25',
    contribution: 'Product Design',
    team: [{ name: 'Denis Kopylov', avatar: '/images/team/denis.jpg', href: '' }],
    sections: [
      {
        title: 'Features',
        items: [
          {
            label: 'Source of Income',
            media: { type: 'image', src: '/images/projects/trade/trade-1.png' },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'playground',
    name: 'Playground',
    description: 'Experiments, prototypes, and personal projects.',
    intro:
      'A collection of experiments, prototypes, and personal projects exploring design, interaction, and code.',
    image: '/images/projects/playground/playground-1.png',
    images: ['/images/projects/playground/playground-1.png'],
    accentColor: '#0064b4',
    accentGradient:
      'linear-gradient(#0064b4 0%, #0060cf 10%, #004dff 26%, #003aff 46%, #0007ff 72%)',
    role: 'Product Designer II',
    year: '2024–25',
    contribution: 'Product Design',
    sections: [
      {
        title: 'Features',
        items: [
          {
            label: 'Statistics',
            media: {
              type: 'image',
              src: '/images/projects/playground/playground-1.png',
            },
          },
        ],
      },
    ],
  },
];
