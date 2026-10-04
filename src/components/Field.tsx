import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface FieldProps {
  label: ReactNode;
  /** Helper text under the control. Hidden while `error` is set. */
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  /** A single form control (Input, Textarea, Select, PasswordInput). It receives id, aria-describedby and aria-invalid. */
  children: ReactElement<Record<string, unknown>>;
}

/** Label + control + hint/error, wired up for screen readers. */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const controlId = (children.props.id as string | undefined) ?? id;
  const noteId = `${controlId}-note`;
  const note = error ?? hint;

  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <label htmlFor={controlId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      {isValidElement(children) &&
        cloneElement(children, {
          id: controlId,
          required,
          invalid: error ? true : undefined,
          'aria-describedby': note ? noteId : undefined,
        })}
      {note && (
        <p id={noteId} className={cx('text-xs', error ? 'text-red-600' : 'text-gray-500')}>
          {note}
        </p>
      )}
    </div>
  );
}
