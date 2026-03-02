export interface ExternalLinkIconProps {
  className?: string;
  size?: number;
  arrowColor?: string;
  circleColor?: string;
  circleOpacity?: number;
}

export function ExternalLinkIcon({
  className,
  size = 32,
  arrowColor = 'currentColor',
  circleColor = '#87C4AF',
  circleOpacity = 0.2,
}: ExternalLinkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={circleColor}
        fillOpacity={circleOpacity}
      />
      <path
        d="M10.5 21L21 10.5M21 10.5H10.5M21 10.5V21"
        stroke={arrowColor}
        strokeWidth="2"
        strokeMiterlimit="1.80775"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
