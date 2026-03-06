export interface TeamMember {
  name: string;
  avatar: string;
  href: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
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
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ostrom',
    name: 'Ostrom',
    description: 'Prototypes and 1 → N features for user friendly electricity.',
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
    accentColor: 'var(--mint-400)',
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
  },
  {
    id: '2',
    slug: 'sample-project-two',
    name: 'Sample Project Two',
    description:
      'An innovative solution that combines cutting-edge technology with intuitive user interfaces.',
    image: '/images/projects/sample-project-two/thumbnail.svg',
  },
  {
    id: '3',
    slug: 'sample-project-three',
    name: 'Sample Project Three',
    description:
      'A comprehensive platform designed to streamline workflows and enhance productivity.',
    image: '/images/projects/sample-project-three/thumbnail.svg',
  },
];
