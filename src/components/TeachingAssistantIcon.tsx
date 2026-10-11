import type { SVGAttributes } from 'react';
import { cx } from '../utils/cx';
import { ICON_TONES, type IconTone } from './iconTones';

export interface TeachingAssistantIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Width and height in px. */
  size?: number;
  /** Palette color for the outline; see `ICON_TONES`. */
  tone?: IconTone;
  /** Accessible name. Leave unset when the icon sits next to text that already says "TA". */
  title?: string;
}

const ROWS = [0, 15.25, 30.5];

/** Checklist clipboard marking teaching assistants. */
export function TeachingAssistantIcon({ size = 24, tone = 'teal', title, className, ...props }: TeachingAssistantIconProps) {
  return (
    <svg
      viewBox="6 4 72 72"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={cx('flex-shrink-0', tone !== 'inherit' && ICON_TONES[tone].outline, className)}
      {...props}
    >
      {title && <title>{title}</title>}
      {/* Clip, then the board, then a check and a line per row; the last line is shorter. */}
      <path d="M31.5 14V9.5h22V14" />
      <rect x={16.5} y={14} width={51} height={57} rx={5.5} />
      {ROWS.map((dy, i) => (
        <path key={dy} d={`M26 ${31 + dy}l4.5 4 6.5-8M43.5 ${32 + dy}H${i === ROWS.length - 1 ? 52 : 56.5}`} />
      ))}
    </svg>
  );
}
