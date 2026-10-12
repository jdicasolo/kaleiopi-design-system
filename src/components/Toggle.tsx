import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Tooltip, type TooltipProps } from './Tooltip';
import { cx } from '../utils/cx';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultChecked' | 'children'> {
  /** Controlled state. Leave unset and use `defaultChecked` to let the toggle manage itself. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Visible text beside the switch. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Shown on hover and keyboard focus. Pass a function to word it by state,
   * e.g. `(on) => on ? 'Turn off reminders' : 'Turn on reminders'`. */
  tooltip?: ReactNode | ((checked: boolean) => ReactNode);
  tooltipPlacement?: TooltipProps['placement'];
  size?: 'sm' | 'md';
  /** Submits "on" under this name while checked, like a checkbox. */
  name?: string;
}

const SIZES = {
  sm: { track: 'w-8 h-[18px]', thumb: 'w-3.5 h-3.5', on: 'translate-x-3.5' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', on: 'translate-x-5' },
};

/** Enable/disable switch. Disabled toggles stay focusable so their tooltip can
 * explain why, but ignore clicks. */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  tooltip,
  tooltipPlacement,
  size = 'md',
  name,
  disabled,
  id,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const [own, setOwn] = useState(defaultChecked);
  const on = checked ?? own;
  const s = SIZES[size];

  const toggle: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] = (e) => {
    onClick?.(e);
    if (disabled || e.defaultPrevented) return;
    if (checked === undefined) setOwn(!on);
    onChange?.(!on);
  };

  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Tooltip content={typeof tooltip === 'function' ? tooltip(on) : tooltip} placement={tooltipPlacement}>
        <button
          type="button"
          role="switch"
          id={switchId}
          aria-checked={on}
          aria-disabled={disabled || undefined}
          onClick={toggle}
          className={cx(
            'relative inline-flex flex-shrink-0 items-center rounded-full p-0.5 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400 focus-visible:ring-offset-2',
            s.track,
            on ? 'bg-kaleiopi-purple-600' : 'bg-gray-300',
            disabled ? 'opacity-50 cursor-not-allowed' : on ? 'hover:bg-kaleiopi-purple-700' : 'hover:bg-gray-400',
          )}
          {...props}
        >
          <span aria-hidden="true" className={cx('rounded-full bg-white shadow-sm transition-transform', s.thumb, on && s.on)} />
        </button>
      </Tooltip>
      {label && (
        <label htmlFor={switchId} className={cx('text-sm text-gray-700 select-none', disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer')}>
          {label}
        </label>
      )}
      {name && on && <input type="hidden" name={name} value="on" />}
    </span>
  );
}
