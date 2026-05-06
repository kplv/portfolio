import type { CSSProperties } from 'react';
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
      playbackRate?: number;
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
  /**
   * Project accent: a CSS color or a CSS gradient (use `oklch()` stops for gradients).
   * For non-text UI that needs a single color, the last stop of a gradient is used.
   */
  accent: string;
  /** When set, used instead of `accent` while `[data-theme='dark']`. */
  accentDark?: string;
  team?: TeamMember[];
  role?: string;
  year?: string;
  contribution?: string;
  sections?: ProjectSection[];
}

const toOklch = converter('oklch');

export function isCssGradient(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v.includes('linear-gradient') ||
    v.includes('radial-gradient') ||
    v.includes('conic-gradient') ||
    v.includes('repeating-linear-gradient') ||
    v.includes('repeating-radial-gradient')
  );
}

/** Last color from gradient (hex, rgb, or oklch), converted to OKLCH */
function lastColorFromGradientInOklch(gradient: string): string | undefined {
  const colorRegex = /#[0-9a-fA-F]{3,8}|rgba?\s*\([^)]+\)|oklch\s*\([^)]+\)/g;
  const matches = gradient.match(colorRegex);
  if (!matches?.length) return undefined;
  const last = matches[matches.length - 1];
  const parsed = toOklch(last);
  return parsed ? formatCss(parsed) : undefined;
}

export function getResolvedAccent(
  project: Project,
  theme: 'light' | 'dark',
): string {
  if (theme === 'dark' && project.accentDark) return project.accentDark;
  return project.accent;
}

/**
 * A single color for borders, tints, and `color-mix` (last stop if `css` is a gradient).
 */
export function getAccentSolid(
  css: string,
  fallback = 'var(--mint-400)',
): string {
  if (isCssGradient(css)) {
    return lastColorFromGradientInOklch(css) ?? fallback;
  }
  return css;
}

/**
 * `var(--…)` that references a gradient (e.g. `var(--text-display-gradient)`) needs the
 * same treatment as a literal gradient.
 */
function isGradientLikeTextFill(css: string): boolean {
  return (
    isCssGradient(css) ||
    (css.includes('var(') && css.toLowerCase().includes('gradient'))
  );
}

export function getAccentTextStyle(css: string): CSSProperties {
  if (isGradientLikeTextFill(css)) {
    return {
      backgroundImage: css,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
    };
  }
  return { color: css };
}

/** For callers that always use `background-clip: text` (twin-stop solid). */
export function getTextClipBackground(css: string): string {
  if (isCssGradient(css)) return css;
  return `linear-gradient(90deg, ${css} 0%, ${css} 100%)`;
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
      'Major features redesign, design engineering, and process improvements for an energy management provider',
    intro:
      'Friendly energy startup with a mobile app to handle all your energy management. Simple flows hide a complex infrastructure underneath, like Germany\u2019s first virtual power plant.',
    image: '/images/projects/ostrom/ostrom-1.png',
    images: [
      '/images/projects/ostrom/ostrom-1.png',
      '/images/projects/ostrom/ostrom-2.png',
      '/images/projects/ostrom/ostrom-3.png',
      '/images/projects/ostrom/ostrom-4.png',
      '/images/projects/ostrom/ostrom-7.png',
      '/images/projects/ostrom/ostrom-8.png',
    ],
    accent:
      'linear-gradient(82.638deg in oklch, oklch(0.5686 0.0823 195.09) 0.85402%, oklch(0.6635 0.1129 188.77) 99.266%)',
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
            text: 'I joined Ostrom to bring expertise in building mobile products with quality, velocity, and scalability in mind. My main contributions included core feature redesigns, a token approach for the design system, new UI components, interactive patterns, and overall design strategy.',
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Redesign' },
          {
            type: 'text',
            text: 'Some parts of the Ostrom app haven\u2019t changed much since its launch in 2022. There was great potential to align them with evolving product strategy, and to bring more value to customers. Better statistics, seamless device onboarding, rewards revamp \u2014 are some examples of shipped improvements.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/ev-stats.png',
                cover: true,
                label:
                  'Charging statistics redesign used components and patterns from a newly established design system. For example, a bottom navigation approach.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/ev-stats-old-vs-new.png',
                cover: true,
                label:
                  'In the new version, focus switched to earnings and spending, and the monthly view became the default.',
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
                  'Solar statistics also changed. I explored graph libraries in React Native, and we tested multiple directions with customers.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/solar-stats-old-vs-new.png',
                cover: true,
                label:
                  'In the new version, instead of having everything on one page, we moved solar statistics to a separate one.',
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
                  'A glimpse of what\u2019s around your house right now. Animations were helpful in showing state \u2014 yes, but also looked nice (\uD83E\uDD7A) ?',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/energy-flow-old-vs-new.png',
                cover: true,
                label:
                  'The new version focused on the main areas of interest: where my energy comes from and how I use it.',
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
              'I used React Native as the main prototyping \u2014 and\u00a0sometimes even hand-off \u2014 tool. It\u2019s way closer to the end experience and easy to handle with a bit of React and TypeScript knowledge.',
              'Of course, I\u2019d follow with a component breakdown and detailed Figma flows. But the groundwork for design system tokens and new components happened in code.',
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
                  'Modal interaction, cards, info elements, and navigation \u2014 examples of components that made it to production from initial prototypes.',
              },
              {
                type: 'video',
                src: '/images/projects/ostrom/timestamp-react-native.mp4',
                cover: true,
                label:
                  'Smaller components also deserved care. This one shows the last updated time, but also handles states gracefully. A skeleton is a nice touch as well.',
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
            text: 'For each major redesign, we based our exploration on data and customer insights. Team workshops and user testing were the main means for team alignment and validation. Usually we tested multiple options, and then released the best ones in short cycles.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'video',
                src: '/images/projects/ostrom/solar-exploration.mp4',
                cover: true,
                playbackRate: 0.5,
                label:
                  'In solar statistics I explored more than 30 approaches. They varied in\u00a0navigation patterns, and how they handled the most common scenarios.',
              },
              {
                type: 'video',
                src: '/images/projects/ostrom/energy-exploration.mp4',
                cover: true,
                playbackRate: 0.5,
                label:
                  'The device chart was no exception either. I looked at it from different angles, including the ones that deviated from competitor research.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/sharing-testing-results.png',
                cover: true,
                label:
                  'After the testing I prepared learnings to share with the team. It helped with alignment, but also reinforced the value of a design team.',
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
            text: [
              'I also worked on growth and funnel optimisation. Social media and our landing page would be the first user touchpoints. So we wanted to improve them in terms of quality, clarity, and brand consistency.',
              'To boost conversion, we optimised the first funnel pages, and tested different directions for marketing materials. The website changes not only improved the conversion significantly, but also set up a base for future A/B experiments.',
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/website-redesign.png',
                cover: true,
                label:
                  'We highlighted each tariff\u2019s unique proposal, pricing, and cancellation policy \u2014 the main points of confusion from research.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/marketing-assets.png',
                cover: true,
                label:
                  'I\u2019ve explored more than 100 versions for marketing templates, with only a few of them being A/B tested in the end.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Design Leadership' },
          {
            type: 'text',
            text: 'Some of my time would go to quarterly planning, process improvement, and hiring. I followed a\u00a0systematic approach to build a robust design function step by step.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/ostrom/management-documents.png',
                cover: true,
                label:
                  'Design patterns I used to systematically improve velocity and the quality of design output. For planning, I used both Notion and Linear (\u2764\ufe0f) to align with the team.',
              },
              {
                type: 'image',
                src: '/images/projects/ostrom/design-strategy.png',
                cover: true,
                label:
                  'Design Strategy was my initiative \u2014 an introspection into the current state of things, and a pitch of the value design could bring.',
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
      'Security features, productivity tools, and key-flows interactions for a biggest investment platform in Europe',
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
    accent:
      'linear-gradient(82.638deg in oklch, oklch(0.4824 0.2723 266.61) 0.85402%, oklch(0.5126 0.2452 265.66) 99.266%)',
    accentDark:
      'linear-gradient(263.068deg in oklch, oklch(0.6438 0.1832 262.69) 22.575%, oklch(0.644 0.1623 258.02) 102.45%)',
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
            text: 'I joined Trade Republic as a Product Designer II, bringing interactive, mobile, and 0 \u2192 1 design expertise. First, we launched the new performance review tool, taking it from the initial idea and cross-company alignment to a fully working product that is still used today. Later, I switched to the financial crime team, where I worked on launching new security features: account protection, new device notifications, and source of wealth.',
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
                'As the company grew, account takeovers became more frequent. Our team’s goal was to protect customers by letting them flag unfamiliar logins. When we detected an unfamiliar login, we sent the customer a notification and temporarily blocked the account if they did not recognise it. The flow was as simple as “Yes” / “No”, and we used customer responses to better train our data models in the end.',
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
                'Once a customer flagged an unfamiliar login, or our models detected suspicious behaviour, we blocked all sensitive operations to protect the customer’s money. We explored different approaches, including blocking access entirely, but ultimately landed on a more elegant solution: customers could still log in, but sensitive actions required identification. This let us verify the account while preventing fraudsters from stealing from it again.',
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
                'As a bank, we have to make sure we know where our customers’ money comes from. For customers, it might seem like a mundane task, so we tried to make it as seamless as possible. We came up with a “shopping basket” solution, where customers can add multiple sources of income, each with its own flow.',
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
                'Interactions and animations have a special place in my heart, so at some point I initiated a project to gradually improve the most-used flows across the app by making them more polished and enjoyable for customers. We started with the most-used screen, which we call the amount screen, by making number inputs and buttons react more smoothly to customer intent.',
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
    description: 'Interactive design and other projects from past years',
    intro:
      'Projects from the past few years. Some were done inside product teams at major tech companies like Yandex. Some won awards such as Red Dot. Some are personal projects where I explored new approaches.',
    image: '/images/playground/play-0.png',
    images: [
      '/images/playground/play-0.png',
      '/images/playground/play-1.png',
      '/images/playground/play-2.png',
      '/images/playground/play-3.png',
      '/images/playground/play-7.png',
    ],
    accent:
      'linear-gradient(82.638deg in oklch, oklch(0.5833 0.2078 8.21) 0.85402%, oklch(0.5914 0.2359 22.78) 99.266%)',
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
