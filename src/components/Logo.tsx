import { cx } from '../utils/cx';
import icon from './kaleiopi-icon.png';

export interface LogoProps {
  /** `icon` is the mark alone; `wordmark` adds the navy "Kaleiopi" text. */
  variant?: 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const HEIGHTS = { sm: 'h-5', md: 'h-8', lg: 'h-12' };
const TEXT = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

export function Logo({ variant = 'wordmark', size = 'md', className }: LogoProps) {
  if (variant === 'icon') return <img src={icon} alt="Kaleiopi" className={cx(HEIGHTS[size], 'w-auto', className)} />;
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <img src={icon} alt="" className={cx(HEIGHTS[size], 'w-auto')} />
      <span className={cx('font-bold tracking-tight text-kaleiopi-navy', TEXT[size])}>Kaleiopi</span>
    </span>
  );
}
