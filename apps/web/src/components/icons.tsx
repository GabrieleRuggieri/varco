import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconHome({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M1.5 6.5 8 1.5l6.5 5V14a.5.5 0 0 1-.5.5H10v-4H6v4H2a.5.5 0 0 1-.5-.5V6.5Z" />
    </svg>
  );
}

export function IconBox({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M13.5 4.5 8 2 2.5 4.5v7L8 14l5.5-2.5v-7Z" />
      <path d="M2.5 4.5 8 7l5.5-2.5M8 14V7" />
    </svg>
  );
}

export function IconList({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2 4h12M2 8h12M2 12h8" />
    </svg>
  );
}

export function IconCheckSquare({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
      <path d="m5 8 2 2 4-4" />
    </svg>
  );
}

export function IconSync({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M13 5.5A5.5 5.5 0 0 0 3 8" />
      <path d="M11.5 5.5H13V4M3 10.5A5.5 5.5 0 0 0 13 8" />
      <path d="M4.5 10.5H3V12" />
    </svg>
  );
}

export function IconLogout({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M6 2H2.5A.5.5 0 0 0 2 2.5v11a.5.5 0 0 0 .5.5H6M10.5 11 14 8l-3.5-3M14 8H6" />
    </svg>
  );
}

export function IconDownload({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 2v8M5 7l3 3 3-3M2 12v1.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V12" />
    </svg>
  );
}

export function IconSparkle({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 1v14M1 8h14M3.5 3.5l9 9M12.5 3.5l-9 9" strokeWidth={1.2} strokeOpacity={0.5} />
      <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWarning({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 1.5 1 14.5h14L8 1.5ZM8 6v4M8 11.5v.5" />
    </svg>
  );
}

export function IconDocument({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9.5 1.5H3a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V5L9.5 1.5Z" />
      <path d="M9.5 1.5V5H13.5M5 8.5h6M5 11h4" />
    </svg>
  );
}

export function IconInbox({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M1.5 9.5h3l2 2.5h3l2-2.5h3M1.5 9.5V13a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V9.5" />
      <path d="M3.5 9.5 5 3h6l1.5 6.5" />
    </svg>
  );
}
