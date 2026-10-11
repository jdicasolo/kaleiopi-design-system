import type { SVGAttributes } from 'react';
import { cx } from '../utils/cx';
import { ICON_TONES, type IconTone } from './iconTones';

export interface ProfessorIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Width and height in px. */
  size?: number;
  /** Palette pairing for the outline and the board's tint; see `ICON_TONES`. */
  tone?: IconTone;
  /** Accessible name. Leave unset when the icon sits next to text that already says "Professor". */
  title?: string;
}

/** Mortarboard marking professors and instructors. */
export function ProfessorIcon({ size = 24, tone = 'brand', title, className, ...props }: ProfessorIconProps) {
  const colors = tone === 'inherit' ? undefined : ICON_TONES[tone];
  return (
    <svg
      viewBox="6 2 72 72"
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
      {/* Cap, then the band below it, then the board on top. */}
      <path d="M22 31v16q20 14 40 0V31" />
      <path d="M31 52v12h22V52" />
      <path
        d="M12 26 42 13l30 13-30 13z"
        className={colors?.tint}
        fill={colors ? undefined : 'currentColor'}
        fillOpacity={colors ? undefined : 0.4}
      />
      {/* Tassel */}
      <path d="M72 26v22" />
      <circle cx={72} cy={52} r={3.75} fill="currentColor" stroke="none" />
    </svg>
  );
}
