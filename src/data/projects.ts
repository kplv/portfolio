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
  team?: TeamMember[];
  role?: string;
  year?: string;
  contribution?: string;
  sections?: ProjectSection[];
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
    accentColor: 'oklch(0.700 0.160 165)',
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
    accentColor: 'oklch(0.35 0.295 265)',
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
    accentColor: 'oklch(0.62 0.22 35)',
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
