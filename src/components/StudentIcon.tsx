import type { SVGAttributes } from 'react';
import { cx } from '../utils/cx';
import { ICON_TONES, type IconTone } from './iconTones';

export interface StudentIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Width and height in px. */
  size?: number;
  /** Palette pairing for the outline and the pocket's tint; see `ICON_TONES`. */
  tone?: IconTone;
  /** Accessible name. Leave unset when the icon sits next to text that already says "Student". */
  title?: string;
}

/** Backpack marking students. Drawn on the same grid and stroke as `ProfessorIcon`
 * and `TeachingAssistantIcon`. */
export function StudentIcon({ size = 24, tone = 'gold', title, className, ...props }: StudentIconProps) {
  const colors = tone === 'inherit' ? undefined : ICON_TONES[tone];
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
      className={cx('flex-shrink-0', colors?.outline, className)}
      {...props}
    >
      {title && <title>{title}</title>}
      {/* Handle, then the bag and its top flap. */}
      <path d="M35 15v-3.5q0-3.5 3.5-3.5h7q3.5 0 3.5 3.5V15" />
      <path d="M33 15h18q13 0 13 13v38q0 5-5 5H25q-5 0-5-5V28q0-13 13-13z" />
      <path d="M20 31q22 9 44 0" />
      {/* Front pocket with its flap and zipper pull. */}
      <rect
        x={28}
        y={45}
        width={28}
        height={19}
        rx={4}
        className={colors?.tint}
        fill={colors ? undefined : 'currentColor'}
        fillOpacity={colors ? undefined : 0.4}
      />
      <path d="M28 52h28M42 52v4" />
    </svg>
  );
}
