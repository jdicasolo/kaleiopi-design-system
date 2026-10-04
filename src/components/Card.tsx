import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `none` is for cards whose content (an image, a table) runs edge to edge. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** `raised` matches the app's modals and popovers. */
  elevation?: 'flat' | 'raised';
}

const PADDING = { none: 'overflow-hidden', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ padding = 'md', elevation = 'flat', className, ...props }: CardProps) {
  return <div className={cx('bg-white rounded-2xl', elevation === 'raised' ? 'shadow-lg' : 'shadow-sm', PADDING[padding], className)} {...props} />;
}
