import { converter, formatCss } from 'culori';

export interface TeamMember {
  name: string;
  avatar: string;
  href: string;
}

export type MediaBlock =
  | {
      type: 'image';
      src: string;
      alt?: string;
      cover?: boolean;
      /** Caption shown below the media in MediaLabel */
      label?: string;
    }
  | {
      type: 'video';
      src: string;
      poster?: string;
      loop?: boolean;
      cover?: boolean;
      scale?: number;
      /** Caption shown below the media in MediaLabel */
      label?: string;
    };

export type SectionBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string | string[] }
  | { type: 'media'; media: MediaBlock | MediaBlock[] };

export interface ProjectSection {
  blocks: SectionBlock[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  /** Short tagline shown on the project card */
  description: string;
  /** Longer intro text shown in the project detail header */
  intro?: string;
  image: string;
  /** When provided, cycles through these instead of single image. */
  images?: string[];
  /** Accent color in OKLCH; derived from last color of accentGradient when not set */
  accentColor?: string;
  /** When provided, used for project detail header and home overlay; accentColor used for other UI */
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

/** Resolves a project when pathname is `/${slug}` for a known project slug. */
export function getProjectByPathname(
  pathname: string,
  projectList: readonly Project[],
): Project | null {
  if (pathname === '/' || pathname === '/about') return null;
  const segment = pathname.slice(1).split('/')[0];
  if (!segment) return null;
  return projectList.find((p) => p.slug === segment) ?? null;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ostrom',
    name: 'Ostrom',
    description:
      'Friendly energy startup with a mobile app for energy management and Germany\u2019s first virtual power plant',
    intro:
      'Friendly energy startup with a mobile app to handle all your energy management. Simple flows hide a complex infrastructure underneath, like a Germany\u2019s first virtual power plant.',
    image: '/images/projects/ostrom/ostrom-1.png',
    images: [
      '/images/projects/ostrom/ostrom-1.png',
      '/images/projects/ostrom/ostrom-2.png',
      '/images/projects/ostrom/ostrom-3.png',
      '/images/projects/ostrom/ostrom-4.png',
      '/images/projects/ostrom/ostrom-7.png',
      '/images/projects/ostrom/ostrom-8.png',
    ],
    accentColor: 'oklch(70% 0.1 186)',
    accentGradient:
      'radial-gradient(circle at 50% 85% in oklch, oklch(0.8 0.1 202) 0%, oklch(0.7 0.1 186) 100%)',
    role: 'Sr. Product Designer',
    year: '2025–26',
    contribution: 'Product Design, Engineering, Strategy',
    team: [],
    sections: [
      {
        blocks: [
          { type: 'heading', text: 'My Role' },
          {
            type: 'text',
            text: 'I joined Ostrom to bring expertise in building mobile products with quality, velocity, and scalability in mind. My main contributions included core features redesigns, token approach for design system, new UI components & interactive patterns, and design strategy.',
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Redesign' },
          {
            type: 'text',
            text: 'Some parts of Ostrom app haven\u2019t changed much since its launch 2022. They were potential to align them more product strategy, and to bring more customer value. Better statistics, seamless onboarding, rewards revamp, \u2014 some of the examples of shipped improvements.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/ev-stats.png',
                cover: true,
                label:
                  'Charging statistics redesign used components and patterns from a newly established design system. For example, a bottom navigation approach',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/ev-stats-old-vs-new.png',
                cover: true,
                label:
                  'In new version focus switched to earnings and spendings, and monthly view became a default.',
              },
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/solar-stats.png',
                cover: true,
                label:
                  'Solar statistics algo changed. I explored graph libraries in React Native, and we tested multiple directions with customers.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/solar-stats-old-vs-new.png',
                cover: true,
                label:
                  'Instead of having everything on one page, we moved statistics to a separate one.',
              },
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'video',
                src: '/images/projects/ostrom/energy-flow.mp4',
                cover: true,
                label:
                  'A glimpse on what\u2019s around your house right now. Animations were helpful in showing state \u2014 yes, but also look nice (\uD83E\uDD7A) ?',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/energy-flow-old-vs-new.png',
                cover: true,
                label:
                  'New version focused on main areas of interest: where my energy come from and how do I use it.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Engineering' },
          {
            type: 'text',
            text: [
              'I used React Native as the main prototyping \u2014 and\u00a0sometimes even \u2014 a hand-off tool. It\u2019s way closer to end customer experience and easy to handle with a bit of React and Typescript knowledge.',
              'Of course, I\u2019d follow with components breakdown and detailed Figma flows. But still groundwork for design system tokens and new components happened in code.',
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'video',
                src: '/images/projects/ostrom/ev-stats-react-native.mp4',
                cover: true,
                scale: 1.12,
                label:
                  'Modal interaction, cards, info elements, and navigation \u2014 examples of UI components that made it to production from initial prototypes.',
              },
              {
                type: 'video',
                src: '/images/projects/ostrom/timestamp-react-native.mp4',
                cover: true,
                label:
                  'Smaller components also deserve care. This one shows last updated time, but also handles states gracefully. A skeleton is a nice touch as well.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Exploration' },
          {
            type: 'text',
            text: 'For each major redesign, we based our exploration on data and customer insights. Team workshops and user testing were main means for team alignment and validation. Usually we tested multiple options, and then the best ones were released in short cycles.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/solar-stats-exploration.png',
                cover: true,
                label:
                  'In solar statistics I explored more than 30+ approaches. They varied in\u00a0navigation patterns, and how they handled most common scenarios.',
              },
              {
                type: 'image',
                src: '/images/projects/shared/empty-image.png',
                cover: true,
                label:
                  'After the testing we\u2019d share learnings with the team. It helped with alignment, but also reinforced the value of a design team.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/energy-flow-exploration.png',
                cover: true,
                label:
                  'I usually explored multiple approaches, including the ones that deviated from competitors research.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Marketing' },
          {
            type: 'text',
            text: 'First, customer would see us somewhere in Instagram, and when would check our tariffs. We wanted to improve quality, clarity, and brand consistency. To boost conversion, we optimised first funnel pages, and tested different directions for marketing materials. Website changes not only improved the conversion significantly, but also set-up base for future A/B experiments.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/shared/empty-image.png',
                cover: true,
                label:
                  'We highlighted each tariff unique proposal, pricing, and cancellation policy \u2014 main point of confusion from research.',
              },
              {
                type: 'image',
                src: '/images/projects/shared/empty-image.png',
                cover: true,
                label:
                  'I\u2019ve created more than 100+ version for marketing templates, with only 4\u00a0of them being A/B tested in the end.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Beyond Hand-On Design' },
          {
            type: 'text',
            text: 'Some of my time would go to quarterly planning, process improvement, and hiring. I followed a\u00a0systematic approach to build a robust design function step by step.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/shared/empty-image.png',
                cover: true,
                label:
                  'There are the patterns for design team to improve velocity and quality output.',
              },
              {
                type: 'image',
                src: '/images/projects/shared/empty-image.png',
                cover: true,
                label:
                  'Design Strategy was my initiative, \u2014 an introspect into current state of things, and a pitch of value the design could bring.',
              },
            ],
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
      "Fraud prevention, delightful interactions, and employee tools for Europe's largest savings platform",
    intro:
      'Built fraud prevention flows from 0\u00a0\u2192\u00a01 for Trade Republic\u2019s 8M+ users, designed micro-interactions for core screens, and shipped an internal performance review tool.',
    image: '/images/projects/trade/trade-0.png',
    images: [
      '/images/projects/trade/trade-0.png',
      '/images/projects/trade/trade-1.png',
      '/images/projects/trade/trade-4.png',
      '/images/projects/trade/trade-5.png',
      '/images/projects/trade/trade-6.png',
    ],
    accentColor: '#153e9b',
    accentGradient:
      'linear-gradient(135deg, #5be7ff 0%, #7858ff 60%, #18345b 100%)',

    role: 'Product Designer II',
    year: '2023–24',
    contribution: 'Product & Interactive Design',
    team: [],
    sections: [
      {
        blocks: [
          { type: 'heading', text: 'My Role' },
          {
            type: 'text',
            text: 'I joined Trade Republic as a Product Designer II, bringing interactive, mobile, and 0 \u2192 1 design expertise. First, we launched the new performance review tool, taking it from the initial idea and cross-company alignment to a fully working product that is still used today. Later, I switched to the financial crime team, where I worked on launching new security features: account protection, new device notification, and source of income.',
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: '0 \u2192 1 Performance Tool' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/projects/trade/trade-review-tool.png',
              cover: true,
              label:
                'One of the first projects we launched was a new tool for performance reviews. We started with extensive alignment sessions with the People team and C-level leadership on the initial goals, then focused on making the experience as seamless and transparent for employees as possible.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Account Protection' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/projects/trade/trade-device-notification.png',
              cover: true,
              label:
                'As the company grew, account takeovers became more frequent. Our team’s goal was to protect customers by letting them flag unfamiliar logins. When we detected an unfamiliar login, we sent the customer a notification and temporarily blocked the account if they did not recognise it. The flow was as simple as “Yes” / “No“, and we used customer responses to better educate our data models in the end.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Blocked Account' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/projects/trade/trade-blocked-acc.png',
              cover: true,
              label:
                'Once a customer flagged an unfamiliar login, or our models detected suspicious behavior, we blocked all sensitive operations to protect the customer’s money. We explored different approaches, including blocking access entirely, but ultimately landed on a more elegant solution: customers could still log in, but sensitive actions required identification. This let us verify the account while preventing fraudsters from stealing from it again.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Source of Wealth' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/projects/trade/trade-source-of-wealth.png',
              cover: true,
              label:
                'As a bank, we have to make sure we know where our customers’ money comes from. For customers, it might seem like a mundane task, so we tried to make it as seamless as possible. We came up with a “shopping basket” solution, where I can add multiple sources of income, each with its own flow.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Interactions In Crucial Flows' },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/projects/trade/trade-2.mp4',
              cover: true,
              label:
                'Interactions and animation have a special place in my heart, so at some point I initiated a project to gradually improve the most-used flows across the app by making them more polished and enjoyable for customers. We started with the most-used screen, which we call the amount screen, by making number inputs and buttons react more smoothly to customer intent.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/projects/trade/trade-3.mp4',
              cover: true,
              label:
                'We also considered how to gracefully handle edge cases, for example, when a customer enters incorrect login details.',
            },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'playground',
    name: 'Other',
    description:
      "Voice assistants, freight sustainability in the UK, and fun stuff I've done over the years",
    intro:
      'Projects of the past few years. Some were done inside product teams at major tech companies like Yandex. Some won awards such as Red Dot. Some are personal projects where I explored new approaches.',
    image: '/images/playground/play-0.png',
    images: [
      '/images/playground/play-0.png',
      '/images/playground/play-1.png',
      '/images/playground/play-2.png',
      '/images/playground/play-3.png',
      '/images/playground/play-7.png',
    ],
    accentColor: 'oklch(0.62 0.20 275)',
    accentGradient:
      'radial-gradient(circle at 50% 85% in oklch, oklch(0.65 0.17 235) 0%, oklch(0.55 0.27 310) 100%)',
    role: 'Designer',
    year: '2022 — Now',
    contribution: 'Everything',
    team: [],
    sections: [
      {
        blocks: [
          { type: 'heading', text: 'Code' },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/playground/play-9.mp4',
              cover: true,
              label:
                'React Native Playground. I have an app where I prototype new components and just generally have fun. Some of it was later used in production for Ostrom.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Interactive Design' },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/playground/play-10.mp4',
              cover: true,
              label:
                'Bownce. I was preparing the Red Dot case for this project, working on micro-interactions and screen transitions.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/playground/play-6.mp4',
              cover: true,
              label:
                'Badoo. A new voice-first dating experience. My graduation project.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/playground/play-5.mp4',
              cover: true,
              label: 'Badoo. Spent a lot of time making the flow feel alive.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Font Design' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/playground/play-1.png',
              cover: true,
              label:
                'Tachkum Font. Final project of the type design workshop by Contrast Foundry in 2022.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/playground/play-2.png',
              cover: true,
              label:
                'Tachkum Font. The name was inspired by an Abkhazian fairy tale.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Projects' },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/playground/play-3.png',
              cover: true,
              label:
                'Arrival. I worked on new features for customer support and fleet management.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'image',
              src: '/images/playground/play-7.png',
              cover: true,
              label:
                'SberDevices. I led a new stream for city exploration features, from voice to TV applications.',
            },
          },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/playground/play-4.mp4',
              cover: true,
              label: 'SberDevices. Prototyping for TV was a fun experience.',
            },
          },
        ],
      },
    ],
  },
];
