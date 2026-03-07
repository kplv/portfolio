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
  /** Spans full width of the 2-col grid */
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
  /** When provided, cycles through these instead of single image. Must match tags length. */
  images?: string[];
  /** Each group displays as {tag1, tag2}. One group per image when cycling. */
  tags?: string[][];
  accentColor?: string;
  /** When provided, used for modal header and home overlay; accentColor used for other UI */
  accentGradient?: string;
  team?: TeamMember[];
  role?: string;
  year?: string;
  contribution?: string;
  sections?: ProjectSection[];
}

/** First hex color from gradient, or undefined if not found */
function firstColorFromGradient(gradient: string): string | undefined {
  const match = gradient.match(/#[0-9a-fA-F]{6}/);
  return match?.[0];
}

/** Resolved accent color: explicit accentColor, or first color from accentGradient, or fallback */
export function getAccentColor(project: Project, fallback = 'var(--mint-400)'): string {
  return (
    project.accentColor ??
    (project.accentGradient ? firstColorFromGradient(project.accentGradient) : undefined) ??
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
    description: 'Prototypes and 1 → N features for user friendly electricity.',
    intro: 'Energy start-up from Berlin with expat friendly mobile application and the first virtual power plant in Germany. Series B with € 30 millions market evaluation.',
    image: '/images/projects/ostrom/ostrom-1.png',
    images: [
      '/images/projects/ostrom/ostrom-1.png',
      '/images/projects/ostrom/ostrom-2.png',
      '/images/projects/ostrom/ostrom-3.png',
      '/images/projects/ostrom/ostrom-4.png',
    ],
    tags: [
      ['Energy Flow'],
      ['Solar Statistics'],
      ['Charging Overivew '],
      ['Daily Charging Sessions'],
    ],
    accentGradient: 'linear-gradient(in oklch 90deg, #007f7e 0.0%, #006660 100.0%)',
    role: 'Sr. Product Designer',
    year: '2025–26',
    contribution: 'Product Design, Frontend',
    team: [
      { name: 'Denis Kopylov', avatar: '/images/team/denis.jpg', href: '' },
      {
        name: 'Team Member 2',
        avatar: 'https://i.pravatar.cc/80?img=32',
        href: '',
      },
      {
        name: 'Team Member 3',
        avatar: 'https://i.pravatar.cc/80?img=47',
        href: '',
      },
    ],
    sections: [
      {
        title: 'Features',
        items: [
          { label: 'Live Energy Graph', media: { type: 'image', src: '/images/projects/ostrom/ostrom-1.png' } },
          { label: 'Solar System Insights', media: { type: 'image', src: '/images/projects/ostrom/ostrom-2.png' } },
          { label: 'Charging Statistics', media: { type: 'image', src: '/images/projects/ostrom/ostrom-3.png' }, fullWidth: true },
          { label: 'Daily Charging Sessions', media: { type: 'image', src: '/images/projects/ostrom/ostrom-4.png' } },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'trade-republic',
    name: 'Trade Republic',
    description: "Worked on security and delight features for EU's largest broker.",
    intro: 'European investing service used by 4M+ investors across 17 markets to trade stocks, ETFs, derivatives, and crypto. Worked on security and delight features.',
    image: '/images/projects/trade/trade-1.png',
    images: [
      '/images/projects/trade/trade-1.png',
    ],
    accentGradient: 'linear-gradient(in oklch 90deg, #006d60 0.0%, #758529 100.0%)',
    role: 'Product Designer II',
    year: '2024–25',
    contribution: 'Product Design',
    team: [
      { name: 'Denis Kopylov', avatar: '/images/team/denis.jpg', href: '' },
      { name: 'Team Member 2', avatar: 'https://i.pravatar.cc/80?img=32', href: '' },
      { name: 'Team Member 3', avatar: 'https://i.pravatar.cc/80?img=47', href: '' },
      { name: 'Team Member 4', avatar: 'https://i.pravatar.cc/80?img=12', href: '' },
    ],
    sections: [
      {
        title: 'Features',
        items: [
          { label: 'Source of Income', media: { type: 'image', src: '/images/projects/trade/trade-1.png' } },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'playground',
    name: 'Playground',
    description: 'Experiments, prototypes, and personal projects.',
    intro: 'Energy start-up from Berlin with expat friendly mobile application and the first virtual power plant in Germany. Series B with €30 millions market evaluation.',
    image: '/images/projects/playground/playground-1.png',
    images: [
      '/images/projects/playground/playground-1.png',
    ],
    accentGradient: 'linear-gradient(in oklch 90deg, #0062a9 0.0%, #ff7500 100.0%)',
    role: 'Product Designer II',
    year: '2024–25',
    contribution: 'Product Design',
    sections: [
      {
        title: 'Features',
        items: [
          { label: 'Statistics', media: { type: 'image', src: '/images/projects/playground/playground-1.png' } },
        ],
      },
    ],
  },
];
