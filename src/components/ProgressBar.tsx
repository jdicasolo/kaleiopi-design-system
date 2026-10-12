import { Check } from 'lucide-react';
import { cx } from '../utils/cx';

export interface ProgressBarProps {
  /** 0 to `max`. */
  value: number;
  max?: number;
  /** Accessible name, e.g. "Quiz progress". */
  label: string;
  /** Show "3 / 10" next to the bar. */
  showCount?: boolean;
  /** Pink is the brand's progress color; teal and gold are alternate accents. */
  color?: 'pink' | 'purple' | 'teal' | 'gold';
  className?: string;
}

const FILLS = { pink: 'bg-kaleiopi-pink', purple: 'bg-kaleiopi-purple-600', teal: 'bg-kaleiopi-teal', gold: 'bg-kaleiopi-gold' };

export function ProgressBar({ value, max = 100, label, showCount = false, color = 'pink', className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamped} className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={cx('h-full rounded-full transition-[width] duration-300', FILLS[color])} style={{ width: `${pct}%` }} />
      </div>
      {showCount && (
        <span className="text-xs font-medium text-gray-500 tabular-nums">
          {clamped} / {max}
        </span>
      )}
    </div>
  );
}

export interface StepIndicatorProps {
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
  className?: string;
}

/** Numbered steps for multi-step flows such as onboarding. */
export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cx('flex items-center gap-2', className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li key={step} className="flex items-center gap-2 flex-1 min-w-0 last:flex-none" aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className={cx(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                state === 'done' && 'bg-kaleiopi-pink text-white',
                state === 'current' && 'bg-kaleiopi-pink-50 text-kaleiopi-navy ring-2 ring-kaleiopi-pink',
                state === 'todo' && 'bg-gray-100 text-gray-600',
              )}
            >
              {state === 'done' ? <Check className="w-4 h-4" strokeWidth={3} role="img" aria-label={`Step ${i + 1}, done`} /> : i + 1}
            </span>
            <span className={cx('text-sm truncate', state === 'todo' ? 'text-gray-500' : 'text-kaleiopi-navy font-medium')}>{step}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className={cx('h-0.5 flex-1 rounded-full', i < current ? 'bg-kaleiopi-pink' : 'bg-gray-200')} />}
          </li>
        );
      })}
    </ol>
  );
}
