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
  /** Optional InfoTable column headers (defaults: Role / Year / Scope) */
  infoRoleLabel?: string;
  infoYearLabel?: string;
  infoContributionLabel?: string;
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
      'App redesign, design engineering, and process improvements for an energy management provider',
    intro:
      'Friendly energy startup with a mobile app to handle all your energy management. Simple flows hide a complex infrastructure underneath, like Germany\u2019s first virtual power plant.',
    image: '/images/projects/ostrom/ostrom-thumbnail.png',
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
      'Security features, internal performance tool, and interaction design of a European savings platform with 8M+ customers',
    intro:
      'At Trade Republic I designed fraud prevention flows for 8M+ users, refined micro-interactions on core screens, and shipped an internal performance review tool.',
    image: '/images/projects/trade/trade-thumbnail.png',
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
            text: 'I joined Trade Republic to bring mobile, interactive, and 0\u00a0\u2192\u00a01 design expertise. My main contributions included the new performance review tool, customer protection features, and improvements to core flows.',
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Performance Tool' },
          {
            type: 'text',
            text: 'As the company grew, we needed clearer alignment on goals and working principles. We ran extensive workshops with the People team and leadership, then designed and shipped an experience that fit how reviews actually ran. It is still used today for all performance reviews and 360\u00b0 feedback.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/trade/review-main-page.png',
                cover: true,
                label:
                  'The main page of the performance review tool focused on at-hand tasks and highlighted timelines for the current review cycle.',
              },
              {
                type: 'image',
                src: '/images/projects/trade/review-skills.png',
                cover: true,
                label:
                  'Trade Republic branding relied heavily on typography, and internal tools were no exception.',
              },
              {
                type: 'image',
                src: '/images/projects/trade/review-summary.png',
                cover: true,
                label:
                  'Before sending the review to a manager, an employee could check that everything looked correct and quickly return to any part of the flow.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Security' },
          {
            type: 'text',
            text: 'Fraud cases happened more often as we scaled, so we invested in stronger customer protection. Over time we shipped features across web and mobile, including new device alerts, ongoing verification, and temporary account freezes. They prevented tens of thousands of euros in damage and helped us train internal models more effectively.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/trade/new-device.png',
                cover: true,
                label:
                  'When we spotted a suspicious login from a new device, the customer immediately received a notification.',
              },
              {
                type: 'image',
                src: '/images/projects/trade/new-device-web-mail.png',
                cover: true,
                label:
                  'I designed the flows with multiple touchpoints in mind: mobile, web, push notifications, and email.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Source of Income' },
          {
            type: 'text',
            text: 'If we did not know where our customers\u2019 money came from, the bank risked major fines. For customers the task felt mundane, so we focused on conversion and completion. The \u201cshopping basket\u201d pattern we shipped stayed simple for most cases but flexible enough for complex situations.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/trade/source-flow.png',
                cover: true,
                label:
                  'We asked customers a few questions about income and kept enough flexibility to cover varied situations.',
              },
              {
                type: 'image',
                src: '/images/projects/trade/source-mail.png',
                cover: true,
                label:
                  'Completion rate was our main success metric. For example, we sent different emails depending on how close the submission deadline was.',
              },
              {
                type: 'image',
                src: '/images/projects/trade/source-failed-state.png',
                cover: true,
                label:
                  'Sometimes we asked customers to upload proof of income. When documents were blurry or incomplete, we sent them back with clear feedback on what to fix.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Interactions' },
          {
            type: 'text',
            text: 'Interface animations always mattered a lot to me. I started a project to improve the busiest flows with clearer state handling and more polished interactions.',
          },
          {
            type: 'media',
            media: [
              {
                type: 'video',
                src: '/images/projects/trade/calculator.mp4',
                cover: true,
                label:
                  'One of the most-used screens in the app. Notice how smooth and snappy the digits and separators feel.',
              },
              {
                type: 'video',
                src: '/images/projects/trade/pincode.mp4',
                cover: true,
                label:
                  'We also handled edge cases with care, for example when a customer enters an incorrect PIN.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'playground',
    name: 'More..',
    description:
      'A mix of product design, code, and experiments from the last several years',
    intro:
      'Ah, a little bit of this and that from 9 years being a designer. My main focus always was a holistic approach, care for details in interactions, and deep technical knowledge.',
    image: '/images/projects/playground/before.png',
    images: [
      '/images/projects/playground/before.png',
      '/images/projects/playground/play-0.png',
      '/images/projects/playground/play-1.png',
      '/images/projects/playground/play-2.png',
      '/images/projects/playground/play-3.png',
      '/images/projects/playground/playground-1.png',
    ],
    accent:
      'linear-gradient(82.638deg in oklch, oklch(0.5833 0.2078 8.21) 0.85402%, oklch(0.5914 0.2359 22.78) 99.266%)',
    infoRoleLabel: 'What I Was Doing',
    infoContributionLabel: 'Where',
    role: 'Design, Code, Typefaces, 3D',
    year: '2017—Now',
    contribution: 'Arrival, SberDevices',
    sections: [
      {
        blocks: [
          { type: 'heading', text: 'React Playground' },
          {
            type: 'text',
            text:
              "I've been working with React for a few years already and I believe, the best design tool should be as close to end experience as possible. Knowledge of material creates ideas for new engineering changes, deeper feasibility insight, and generates ideas for exploration.",
          },
          {
            type: 'media',
            media: {
              type: 'video',
              src: '/images/projects/playground/expo.mp4',
              cover: true,
              label:
                'I have an Expo playground, where I explore components, patterns, and familiarise with platform concepts.',
            },
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'Interactive Design' },
          {
            type: 'text',
            text: [
              'Tuned timing, physics-based animations, care for how everything fit together — all of it could elevate product. I leaned in heavily into micro-interactions, fluidity, and usability of touch-design. That allowed me to chip in projects, where I\'d fine tune interactive part, or provide interactive concept exploration.',
              'Kudos to our teacher at design school Sergey Galtsev. Both for opportunities, but also for initial inclination in interaction design, all starting from my early work at :redmadrobot design agency.',
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'video',
                src: '/images/projects/playground/bownce.mp4',
                cover: true,
                label:
                  'Bownce won a bronze (🥉  ) in Red Dot Awards in 2019. I was preparing flows navigation and micro-interactions.',
              },
              {
                type: 'video',
                src: '/images/projects/playground/maestrello.mp4',
                cover: true,
                label:
                  'Maestrello — my beloved Italian pizza in Moscow. It was nice to fine-tune interactions for a mobile version.',
              },
              {
                type: 'video',
                src: '/images/projects/playground/trading-platform.mp4',
                cover: true,
                label:
                  'One of initial interaction concepts for a trading platform UI I worked on. In a visual concept we aimed to make a bold statement, and a fluid navigation.',
              },
              {
                type: 'video',
                src: '/images/projects/playground/badoo.mp4',
                cover: true,
                label:
                  'Badoo\'s voice-first dating, our graduation project from BHSAD with focus on joyful experience, and new approach to familiar products.',
              },
            ],
          },
        ],
      },
      {
        blocks: [
          { type: 'heading', text: 'SberDevices' },
          {
            type: 'text',
            text: [
              'In 2022, I joined a new startup, who were to launch a new tablet device with a voice-assistant on Russian market. Eventually a startup were to have 10M MAU customers, but at the beginning my role was 0 → 1 product design of a new product stream there. ',
              'I joined a team of geo services. We would allow folks to look for places, like restaurants and cinemas, buy movie tickets, book and plan events, — and a lot more. All features were voice controlled as well. I worked on all major launches in research, delivery, and ongoing improvement stages.',
            ],
          },
          {
            type: 'media',
            media: [
              {
                type: 'image',
                src: '/images/projects/playground/sberdevies-tv-mobile.png',
                cover: true,
                label:
                  'Mobile and TV worked the same conceptually, but always catered for specific platform patterns.',
              },
              {
                type: 'video',
                src: '/images/projects/playground/sberdevices-tv-navigation.mp4',
                cover: true,
                label:
                  'TV application used React Underneath, but hardware should be accounted for, no fancy stuff.',
              },
            ],
          },
        ],
      },
    ],
  },
];
