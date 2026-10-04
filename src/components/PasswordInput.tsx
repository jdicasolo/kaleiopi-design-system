import { forwardRef, useEffect, useState } from 'react';
import { cx } from '../utils/cx';
import { controlClasses, type InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'type'>;

/** Drop-in replacement for <input type="password"> with a show/hide toggle.
 *
 * Always renders a single <input> whose `type` flips between "password" and
 * "text" — never two inputs swapped via a conditional, which would remount
 * the DOM node and break browser autofill and password managers.
 *
 * Re-masks when the user steps away (tab switch, app switch, phone lock),
 * since the shoulder-surfing risk is about the screen, not focus. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { invalid, controlSize, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('blur', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('blur', hide);
    };
  }, [visible]);

  return (
    <div className="relative">
      <input
        ref={ref}
        {...props}
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        className={cx(controlClasses(invalid, controlSize), 'pr-10', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400"
      >
        <span aria-hidden="true">{visible ? '🙈' : '👁️'}</span>
      </button>
    </div>
  );
});
