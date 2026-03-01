export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  // tags?: string[]; // Future: add tags when ready
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ostrom',
    name: 'Ostrom',
    description: 'Prototypes and 1 → N features for user friendly electricity.',
    image: '/images/projects/ostrom/thumbnail.png',
  },
  {
    id: '2',
    slug: 'sample-project-two',
    name: 'Sample Project Two',
    description: 'An innovative solution that combines cutting-edge technology with intuitive user interfaces.',
    image: '/images/projects/sample-project-two/thumbnail.svg',
  },
  {
    id: '3',
    slug: 'sample-project-three',
    name: 'Sample Project Three',
    description: 'A comprehensive platform designed to streamline workflows and enhance productivity.',
    image: '/images/projects/sample-project-three/thumbnail.svg',
  },
];
