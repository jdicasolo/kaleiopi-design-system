import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type BadgeTone = 'neutral' | 'brand' | 'gold' | 'pink' | 'teal' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Brand accents (gold, pink, teal) use a pale tint with navy text so they pass WCAG AA.
   * success/warning/danger are functional colors and stay off-brand on purpose. */
  tone?: BadgeTone;
  size?: 'sm' | 'md';
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-600',
  brand: 'bg-kaleiopi-purple-50 text-kaleiopi-purple-700 border border-kaleiopi-purple-200',
  gold: 'bg-kaleiopi-gold-50 text-kaleiopi-navy border border-kaleiopi-gold-200',
  pink: 'bg-kaleiopi-pink-50 text-kaleiopi-navy border border-kaleiopi-pink-200',
  teal: 'bg-kaleiopi-teal-50 text-kaleiopi-navy border border-kaleiopi-teal-200',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
};

export function Badge({ tone = 'neutral', size = 'md', className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
