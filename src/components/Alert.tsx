import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  tone?: AlertTone;
  title: ReactNode;
  children?: ReactNode;
  /** Leading emoji or icon, as used across the app's banners. */
  icon?: ReactNode;
  /** A trailing action, typically a small pill Button. */
  action?: ReactNode;
  className?: string;
}

const TONES: Record<AlertTone, { box: string; title: string; body: string }> = {
  info: { box: 'bg-kaleiopi-purple-50 border-kaleiopi-purple-200', title: 'text-kaleiopi-navy', body: 'text-kaleiopi-purple-800' },
  success: { box: 'bg-emerald-50 border-emerald-200', title: 'text-emerald-800', body: 'text-emerald-700' },
  warning: { box: 'bg-amber-50 border-amber-200', title: 'text-amber-800', body: 'text-amber-700' },
  error: { box: 'bg-red-50 border-red-200', title: 'text-red-800', body: 'text-red-700' },
};

/** Inline, non-blocking banner — e.g. the "verify your email" prompt. */
export function Alert({ tone = 'info', title, children, icon, action, className }: AlertProps) {
  const t = TONES[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('border rounded-xl p-4 text-left flex items-center justify-between gap-4 flex-wrap', t.box, className)}
    >
      <div className="min-w-0">
        <p className={cx('text-sm font-semibold', t.title)}>
          {icon && <span aria-hidden="true">{icon} </span>}
          {title}
        </p>
        {children && <div className={cx('text-xs mt-0.5', t.body)}>{children}</div>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
