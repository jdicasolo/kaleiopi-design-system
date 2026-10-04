import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'celebrate';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `celebrate` is the gold-tint donation/streak treatment. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fully rounded — the app uses this for compact inline actions and chips. */
  pill?: boolean;
  fullWidth?: boolean;
  /** Disables the button and swaps the label for `loadingLabel`. */
  loading?: boolean;
  loadingLabel?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-kaleiopi-purple-600 text-white hover:bg-kaleiopi-purple-700',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-kaleiopi-purple-600 hover:bg-kaleiopi-purple-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  // Pale tint + navy text: the AA-safe pattern for gold (docs/brand-colors.md).
  celebrate: 'bg-kaleiopi-gold-50 text-kaleiopi-navy border border-kaleiopi-gold-200 hover:bg-kaleiopi-gold-100',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', pill = false, fullWidth = false, loading = false, loadingLabel = 'Working…', disabled, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        pill ? 'rounded-full' : 'rounded-lg',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? loadingLabel : children}
    </button>
  );
});
