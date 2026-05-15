'use client';

export interface ArrowUpRightIconProps {
  className?: string;
}

/** Inline arrow; size via `className` (e.g. `1em` × `1em` from CSS). */
export function ArrowUpRightIcon({ className }: ArrowUpRightIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM9.50586 7.97949L9.5166 9.79688L12.7988 9.75586L7.59473 14.959L8.96582 16.3301L14.1699 11.127L14.1279 14.4082L15.9453 14.4189L15.9668 7.97949H9.50586Z"
        fill="currentColor"
      />
    </svg>
  );
}
