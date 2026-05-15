'use client';

/** Stable defs ids: single instance per page avoids useId / SSR counter drift vs many YearTag icons. */
const LINKEDIN_GRADIENT_ID = 'linkedin-icon-grad';
const LINKEDIN_MASK_ID = 'linkedin-icon-mask';

const LINKEDIN_PATH =
  'M24 5.47059V22.5294C24 22.9194 23.8451 23.2935 23.5693 23.5693C23.2935 23.8451 22.9194 24 22.5294 24H5.47059C5.08056 24 4.70651 23.8451 4.43073 23.5693C4.15494 23.2935 4 22.9194 4 22.5294V5.47059C4 5.08056 4.15494 4.70651 4.43073 4.43073C4.70651 4.15494 5.08056 4 5.47059 4H22.5294C22.9194 4 23.2935 4.15494 23.5693 4.43073C23.8451 4.70651 24 5.08056 24 5.47059ZM9.88235 11.6471H6.94118V21.0588H9.88235V11.6471ZM10.1471 8.41177C10.1486 8.18929 10.1063 7.96869 10.0226 7.76255C9.93891 7.55642 9.81542 7.36879 9.65919 7.21039C9.50297 7.05198 9.31708 6.92589 9.11213 6.83933C8.90718 6.75277 8.68718 6.70742 8.46471 6.70588H8.41177C7.95934 6.70588 7.52544 6.88561 7.20552 7.20552C6.88561 7.52544 6.70588 7.95934 6.70588 8.41177C6.70588 8.86419 6.88561 9.29809 7.20552 9.61801C7.52544 9.93792 7.95934 10.1176 8.41177 10.1176C8.63426 10.1231 8.85565 10.0847 9.06328 10.0046C9.27092 9.92447 9.46074 9.80422 9.62189 9.65072C9.78304 9.49722 9.91237 9.31346 10.0025 9.10996C10.0926 8.90646 10.1417 8.6872 10.1471 8.46471V8.41177ZM21.0588 15.3412C21.0588 12.5118 19.2588 11.4118 17.4706 11.4118C16.8851 11.3824 16.3021 11.5072 15.7799 11.7734C15.2576 12.0397 14.8143 12.4383 14.4941 12.9294H14.4118V11.6471H11.6471V21.0588H14.5882V16.0529C14.5457 15.5403 14.7072 15.0315 15.0376 14.6372C15.3681 14.2429 15.8407 13.9949 16.3529 13.9471H16.4647C17.4 13.9471 18.0941 14.5353 18.0941 16.0176V21.0588H21.0353L21.0588 15.3412Z';

export interface LinkedInIconProps {
  className?: string;
  size?: number;
}

export function LinkedInIcon({
  className,
  size = 28,
}: LinkedInIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={LINKEDIN_GRADIENT_ID}
          x1="14"
          y1="0"
          x2="14"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="49.818%" stopColor="var(--mint-400)" />
          <stop offset="100%" stopColor="var(--mint-500)" />
        </linearGradient>
        <mask
          id={LINKEDIN_MASK_ID}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="28"
        >
          <rect width="28" height="28" fill="black" />
          <path d={LINKEDIN_PATH} fill="white" />
        </mask>
      </defs>
      <rect
        width="28"
        height="28"
        fill={`url(#${LINKEDIN_GRADIENT_ID})`}
        mask={`url(#${LINKEDIN_MASK_ID})`}
      />
    </svg>
  );
}
